var chalk = require('chalk'); // command line colors, fully optional


module.exports = {
    log: (endpoint, message) => {
      console.log(chalk.green(endpoint), message);
    }
}


