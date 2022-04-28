import React from 'react';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);
let database = null;

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase({
      name: 'TakeoApp.sqlite'
    }, () => {
      if (database !== null) {
        return resolve(database);
      } else {
        database = db;
      }

      resolve(db);
    }, error => {
      console.log('Open media database error');
      reject(error);
    });
  });
};

const createMediaTable = () => {
  return new Promise((resolve, reject) => {
    openDatabase().then(db => {
      db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS "media" (
            "id"	INTEGER,
            "remote_uri"	TEXT NOT NULL,
            "local_uri"	TEXT NOT NULL,
            PRIMARY KEY("id" AUTOINCREMENT)
          );`, []);
      }, error => reject(error), () => resolve(db));
    });
  });
};

export const useMediaDb = () => {
  const [db, setDb] = React.useState();
  React.useEffect(() => {
    createMediaTable().then(openDb => setDb(openDb));
  });
  return db;
};
//# sourceMappingURL=database.js.map