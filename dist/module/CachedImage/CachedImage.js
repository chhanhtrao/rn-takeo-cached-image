import React from 'react';
import { Image } from 'react-native';
import * as RNSF from 'react-native-fs';
import { useMediaDb } from '../hook/database';

const download = (uri, localURI) => {
  const remoteUri = uri;
  const {
    promise
  } = RNSF.downloadFile({
    fromUrl: remoteUri,
    toFile: localURI
  });
  return promise;
};

export const getLocalURI = (remoteUri, db) => {
  return new Promise(resolve => {
    if (db === undefined) {
      return resolve(null);
    }

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM media WHERE remote_uri=?', [remoteUri], (_tx, result) => {
        var _result$rows$item;

        let localUri = (_result$rows$item = result.rows.item(0)) === null || _result$rows$item === void 0 ? void 0 : _result$rows$item.local_uri;

        if (localUri !== undefined) {
          return resolve(localUri);
        }

        localUri = RNSF.DocumentDirectoryPath + '/' + remoteUri.split('/').pop();
        download(remoteUri, localUri).then(_res => {
          resolve(localUri);
          db.transaction(tx1 => {
            tx1.executeSql('INSERT INTO media ("remote_uri", "local_uri") VALUES (?1, ?2);', [remoteUri, localUri]);
          });
        }).catch(err => {
          console.log('error on saving new media record', err);
        });
      });
    });
  });
};
export const CachedImage = props => {
  const source = props === null || props === void 0 ? void 0 : props.source;
  const db = useMediaDb();
  const [localUri, setLocalUri] = React.useState();
  const imageProps = { ...props,
    source: { ...source,
      uri: localUri
    }
  };
  React.useEffect(() => {
    if (db === undefined) {
      return;
    }

    getLocalURI(source === null || source === void 0 ? void 0 : source.uri, db).then(uri => {
      setLocalUri(uri);
    });
  }, [db, source === null || source === void 0 ? void 0 : source.uri]);
  return /*#__PURE__*/React.createElement(Image, imageProps);
};
//# sourceMappingURL=CachedImage.js.map