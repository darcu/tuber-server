const express = require("express");
const log = require("./util.js").log;
const port = 5454;

const app = express();

const init = () => {
  app.listen(port);
}

app.get("/", (req, res) => res.send("Tuber Server"));

app.get("/api/test", (req, res) => {
  log("/test");
  res.send("API working");
});

const id = 0;
app.get(`/api/list/${id}`, (req, res) => {

});

module.exports = {
  init
};