const chalk = require('chalk');
const Configstore = require('configstore');
const Progress = require('cli-progress');

const TezosBF = require('../tezosbf');

const {
  CONFIG,
  MODES,
  ANCHOR
} = require('../constants');

const config = new Configstore(CONFIG.APP_ID, CONFIG.BASE, CONFIG.OPTIONS);

function publishResult(fn, text = "", padding = 5){
  const size = 2 * padding + text.length;
  let emptyLine = "";
  let textLine = text;

  for(let i=0; i<size; i++){
    if(textLine.length < size){
      textLine = ` ${textLine} `;
    }

    emptyLine += " ";
  }

  console.log(fn(`${emptyLine}\n${textLine}\n${emptyLine}`));
}

function doRecovery(){
  if(JSON.stringify(config.all, null, '') == '{}'){
    console.log(chalk.red('You have no configuration to start password research.'));
    console.log(chalk.yellow(`\nPlease run \'${chalk.green('node start --config')}\'.\n\n`));
    return;
  }

  const tezosBF = new TezosBF(config.all);

  if(!tezosBF.isValid){
    console.log(chalk.red('Your configuration is broken.'));
    console.log(chalk.yellow(`\nPlease run \'${chalk.green('node start --config')}\'.\n\n`));
    return;
  }

  if(tezosBF.mode == MODES.PWSEEDS){
    console.log("Starting Password Matrix bruteforcing...\n");
  } else if(tezosBF.mode == MODES.BRUTEFORCE){
    console.log("Starting Charset bruteforcing...\n");
  }

  const progress = new Progress.Bar({}, Progress.Presets.shades_classic);
  progress.start(tezosBF.totalPasswordsCount, 0);

  tezosBF.onTick = function(count, map){
    progress.update(count);
    config.set(ANCHOR, map);
  };
  tezosBF.onSuccess = function(password){
    publishResult((t) => chalk.bgGreen(chalk.black(t)), `Password found! ${password}`);
  };
  tezosBF.onFail = function(){
    progress.stop();
    publishResult((t) => chalk.bgRed(chalk.black(t)), "Sorry, Password found with the set parameters!");
    config.delete(ANCHOR);
  };

  tezosBF.find();
}

module.exports = doRecovery;
