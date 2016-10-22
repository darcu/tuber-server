const chalk = require('chalk');
const shortid = require("shortid");


module.exports = {
  log: (endpoint, ...data) => {
    console.log("\n\n", chalk.green(endpoint + ":"), ...data);
  },

  error: (err, ...data) => {
    console.log("\n\n", chalk.red(err + ":"), ...data);
  },

  generateId: shortid.generate,

  isDebug: true
}
