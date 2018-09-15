const doTest = require('./commands/test');

try {
  const clear = require('clear');
  const chalk = require('chalk');
  const figlet = require('figlet');
  const minimist = require('minimist');

  const doHelp = require('./commands/help');
  const doConfig = require('./commands/config');
  const doRecovery = require('./commands/recovery');

  figlet('Tezos Wallet Recovery', (err, data) => {
    clear();

    if(err){
      console.error(err);
      return;
    }

    console.log(chalk.magenta(`\n${data}\n`));

    const argv = minimist(process.argv.slice(2));
    const comp = argv._[0] || null;

    if (argv.config || comp == 'config') {
      doConfig();
    } else if(argv.recovery || comp == 'recovery') {
      doRecovery();
    } else if(argv.test || comp == 'test'){
      doTest();
    } else {
      doHelp();
    }
  });
} catch(err){
  doTest();
}
