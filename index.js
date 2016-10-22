const db = require("./db.js");
const api = require("./api.js");
const log = require("./util.js").log;

db.init((err) => {
  if (err) {
    log("DB INIT ERROR: ", err || "FUCK IF I KNOW");
    return;
  }
  
  api.init();
});
