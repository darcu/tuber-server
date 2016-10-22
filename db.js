const MongoClient = require("mongodb").MongoClient;
const {error, generateId, isDebug, log} = require('./util.js');

const dbURL = "mongodb://localhost:27017/tuber";

let db = null;
let listCollections = null;

const init = (cb) => {
  MongoClient.connect(dbURL, (err, dbase) => {
    if (err) return cb(err);

    db = dbase;
    listCollections = db.collection("lists");
    cb(null);
  });
};


const addList = (cb, title) => {
  listCollections.insert({
    id: generateId(),
    title,
    songs: []
  }, (err, result) => {
    if (err) return cb(err);

    cb(null, result.ops[0]);
  });
};

const updateList = (cb, id, title) => {
  listCollections.update({id}, {$set: {title}}, (err, results) => {
    if (err) return cb(err);

    listLists();
    cb(null, results.result);
  });
};

const addToList = (cb, id, url) => {
  listCollections.update({id}, {$push: {songs: {id: generateId(), url}}}, (err, results) => {
    if (err) return cb(err);

    listSongs(id);
    listLists();
    cb(null, results.result);
  });
};

const removeFromList = (cb, id, songId) => {
  listCollections.update({id}, {$pull: {songs: {id: songId}}}, (err, results) => {
    if (err) return cb(err);

    setTimeout(() => {
      listSongs(id);
      listLists();
    }, 300);
    cb(null, results.result);
  });
};

const getAllLists = (cb) => {
  listCollections.find({}).toArray((err, result) => {
    if (err) return cb(err);

    listLists();
    cb(null, result);
  });
};

const getList = (cb, id) => {
  listCollections.findOne({id}, (err, result) => {
    if (err) return cb(err);

    listLists();
    cb(null, result);
  });
}

const deleteList = (cb, id) => {
  listCollections.remove({id}, (err, result) => {
    if (err) return cb(err);

    listLists();
    cb(null, result.result);
  });
};

const listSongs = (id) => isDebug && listCollections.find({id}).toArray((err, result) => log("SONGS", result[0].songs));
const listLists = () => isDebug && listCollections.find().toArray((err, result) => log("LISTS", result));

module.exports = {
  init,
  addList,
  getAllLists,
  getList,
  deleteList,
  updateList,
  addToList,
  removeFromList
};
