
function doTest(){
  let test = false;

  try {
    const chalk = require('chalk');
    const Configstore = require('configstore');
    const Progress = require('cli-progress');
    const TezosBF = require('../tezosbf');

    if(chalk && Configstore && Progress && TezosBF){
      test = true;
    }
  } catch(err){
    test = false;
  }

  if(test){
    console.log(`Hi, ready to help you :)\n\n`);
  } else {
    console.error(`ERROR!\n\nSeems all the needed dependencies were not installed.\nPlease write:\n\n\tnpm install\n\nand press Enter to run and complete the process.`);
  }
}

module.exports = doTest;
