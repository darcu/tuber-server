const express = require("express");
const bodyParser = require("body-parser");

const db = require("./db.js");
const log = require("./util.js").log;

const port = 5454;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const init = () => app.listen(port);


app.get("/", (req, res) => res.send("Tuber Server Documentation (coming...)"));


/**** LISTS ****/

const validate = (res, ...params) => {
  if (params.some(param => !param)) {
    res.status(400).send("Invalid parameters");
    return false;
  }

  return true;
};


const handle = (res, okStatus = 200) => (err, result) => {
  if (err) return res.status(520).send({err});

  res.status(okStatus).send(result);
}

app.route("/list")
  .get((req, res) => db.getAllLists(handle(res)))
  .post((req, res) => {
    const title = req.body.title;
    if (!validate(res, title)) return;

    db.addList(handle(res, 201), title);
  });

app.route("/list/:id")
  .get((req, res) => {
    const id = req.params.id;
    if (!validate(res, id)) return;

    db.getList(handle(res), req.params.id);
  })
  .patch((req, res) => {
    const id = req.params.id;
    const title = req.body.title;
    if (!validate(res, id, title)) return;

    db.updateList(handle(res), id, title);
  })
  .delete((req, res) => {
    const id = req.params.id;
    if (!validate(res, id)) return;
  
    db.deleteList(handle(res), id);
  });

app.route("/list/:id/song")
  .post((req, res) => {
    const id = req.params.id;
    const url = req.body.url;
    if (!validate(res, id, url)) return;

    db.addToList(handle(res, 201), id, url);
  });

app.route("/list/:id/song/:songId")
  .delete((req, res) => {
    const id = req.params.id;
    const songId = req.params.songId;
    if (!validate(res, id, songId)) return;
  
    db.removeFromList(handle(res), id, songId);
  });

module.exports = {init};
