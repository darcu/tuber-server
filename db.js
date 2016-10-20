const MongoClient = require("mongodb").MongoClient;

const log = require('./util.js').log;

const dbURL = "mongodb://localhost:27017/tuber";


const init = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL, (err, db) => {
      if (err) {
        reject(err);
      }

      log("Connected successfully to server", db);
      resolve();
    });
  });
};

module.exports = {init};
