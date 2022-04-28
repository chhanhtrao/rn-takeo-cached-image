import React from 'react';
import {Image, ImageProps} from 'react-native';
import * as RNSF from 'react-native-fs';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {useMediaDb} from '../hook/database';

const download = (uri: string, localURI: string) => {
  const remoteUri = uri;

  const {promise} = RNSF.downloadFile({
    fromUrl: remoteUri,
    toFile: localURI,
  });
  return promise;
};

export const getLocalURI = (
  remoteUri: string,
  db?: SQLiteDatabase,
): Promise<any> => {
  return new Promise(resolve => {
    if (db === undefined) {
      return resolve(null);
    }

    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM media WHERE remote_uri=?',
        [remoteUri],
        (_tx: any, result: any) => {
          let localUri = result.rows.item(0)?.local_uri;
          if (localUri !== undefined) {
            return resolve(localUri);
          }
          localUri =
            RNSF.DocumentDirectoryPath + '/' + remoteUri.split('/').pop();
          download(remoteUri, localUri)
            .then((_res: any) => {
              resolve(localUri);
              db.transaction((tx1: any) => {
                tx1.executeSql(
                  'INSERT INTO media ("remote_uri", "local_uri") VALUES (?1, ?2);',
                  [remoteUri, localUri],
                );
              });
            })
            .catch(err => {
              console.log('error on saving new media record', err);
            });
        },
      );
    });
  });
};

export const CachedImage = (props: ImageProps) => {
  const source: any = props?.source;
  const db = useMediaDb();
  const [localUri, setLocalUri] = React.useState();
  const imageProps = {...props, source: {...source, uri: localUri}};

  React.useEffect(() => {
    if (db === undefined) {
      return;
    }
    getLocalURI(source?.uri, db).then(uri => {
      setLocalUri(uri);
    });
  }, [db, source?.uri]);

  return <Image {...imageProps} />;
};
