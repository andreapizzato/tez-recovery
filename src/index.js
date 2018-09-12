const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const minimist = require('minimist');

const doConfig = require('./commands/config');
const doStart = require('./commands/start');

figlet('Tezos wallet bruteforcer', (err, data) => {
  clear();

  if(err){
    console.error(err);
    return;
  }

  console.log(chalk.magenta(`\n${data}\n`));

  const argv = minimist(process.argv.slice(2));

  if (argv.config) {
    doConfig();
  } else if(argv.start) {
    doStart();
  } else {
  }
});
