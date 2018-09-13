const inquirer = require('inquirer');
const chalk = require('chalk');
const Configstore = require('configstore');

const {
  CONFIG,
  CHARSETS,
  AMERICAN_CHARSET,
  WALLET,
  MNEMONIC,
  MODE,
  MODES,
  MATRIX,
  CHARSET,
  JUMP,
  LENGTH
} = require('../constants');

const Optimizer = require('../optimizer');

const Yes = (answer) => answer == 'Yes';

const config = new Configstore(CONFIG.APP_ID, CONFIG.BASE, CONFIG.OPTIONS);

function doPasswordSeeds(first = true, matrix = []){
  if(first){
    console.log(chalk.yellow("\nWelcome to Password Matrix configurator. Here you can create a simple passwords list to try out, or, if your password could be composed of more than one part, create a new Password generator Matrix.\n"));
  }

  let questions = [
    {
      type: 'input',
      name: 'seeds',
      message: first 
        ? 'Type here a list of passwords/password parts you remember, separated by a whitespace (e.g. pw1 pw2 pw3):'
        : 'Type another list of password parts to be added to your Password Matrix:',
    },
    {
      type: 'list',
      name: 'doMatrix',
      message: first 
        ? `Do you want to create a Password Matrix? ${chalk.magenta('If you are satisfied by the list above and want to try it out now, please select No.')}`
        : `Do you want to add parts to your Password Matrix? ${chalk.magenta('If you\'re finished, please select No.')}`,
      choices: ['Yes', 'No'],
    }
  ];

  inquirer.prompt(questions).then(answers => {
    if(answers.seeds){
      const seeds = answers.seeds.split(' ');

      if(seeds && seeds.length){
        matrix.push(['', ...seeds]);
      }
    } else {
      doPasswordSeeds(true);
      return;
    }

    if(Yes(answers.doMatrix)){
      doPasswordSeeds(false, matrix);
    } else {
      console.log(chalk.yellow('\nYour Password Matrix is:'));
      console.log(chalk.cyan(`\t${JSON.stringify(matrix, null, '')}`));
      config.set(MATRIX, matrix);
    }
  });
}

function doCharsetTool(){
  console.log(chalk.yellow("\nWelcome to bruteforce mode.\nYou will be guided by a tool to reduce the charset used in bruteforcing procedure. The aim of this optimization is to drastically reduce the iterations of the permutations needed to find your password thus reducing the time taken.\n"));

  let questions = [
    {
      type: 'list',
      name: 'hasPasswordsHints',
      message: 'Do you remember at least 5 passwords you typed or tought of recently?',
      choices: ['Yes', 'No'],
    }
  ];

  inquirer.prompt(questions).then(answers => {
    if(Yes(answers.hasPasswordsHints)){
      doPasswordCharsetOptimization();
    } else {
      doPasswordCharsetSelection();
    }
  });
}

function doPasswordCharsetOptimization(){
  let questions = [
    {
      type: 'input',
      name: 'charset',
      message: 'Type here all the passwords you can remember for charset extraction, separated by a whitespace (e.g. pw1 pw2 pw3):'
    },
  ];

  inquirer.prompt(questions).then(answers => {
    if(answers.charset){
      const opt = new Optimizer(answers.charset);

      const charset = opt.getCharset();

      console.log(chalk.yellow("\nYour optimized charset is:"));
      console.log(chalk.cyan(`\t${charset}`));
      console.log(chalk.yellow(`\nwhich includes ${charset.length} chars, ${AMERICAN_CHARSET.length - charset.length} less than the full American charset.`));

      config.set(CHARSET, charset);
      doLengthSelection();
    } else {
      console.log(chalk.magenta("\nSeems you don\'t remember anything useful, let\'s move to manual charset selection."));
      doPasswordCharsetSelection();
    }
  });
}

function doPasswordCharsetSelection(){
  let questions = [
    {
      type: 'list',
      name: 'charset',
      message: `Please choose the charset you think your password may be composed of. ${chalk.magenta('Remember: less chars, less time to find your password.')}`,
      choices: CHARSETS,
    }
  ];

  inquirer.prompt(questions).then(answers => {
    if(answers.charset){
      const charset = answers.charset;

      console.log(chalk.yellow("\nYour charset is:"));
      console.log(chalk.cyan(`\t${charset}`));

      if(AMERICAN_CHARSET.length - charset.length){
        console.log(chalk.yellow(`\nwhich includes ${charset.length} chars, ${AMERICAN_CHARSET.length - charset.length} less than the full American charset.`));
      } else {
        console.log(chalk.yellow(`\nwhich includes ${charset.length} chars, the full American charset.`));
      }

      config.set(CHARSET, charset);
      doLengthSelection();
    } else {
      doPasswordCharsetSelection();
    }
  });
}

function doLengthSelection(){
  let questions = [
    {
      type: 'input',
      name: 'size',
      message: `What password length should we bruteforce? (min. 1) ${chalk.magenta('Please try with what you believe is the shortest length before trying higher numbers.')}`
    }
  ];

  inquirer.prompt(questions).then(answers => {
    if(answers.size){
      config.set(LENGTH, parseInt(answers.size, 10));
      doPatternSelection();
    } else {
      doLengthSelection();
    }
  });
}

function doPatternSelection(){
  let questions = [
    {
      type: 'list',
      name: 'jump',
      message: `Would you like to skip some combinations? ${chalk.magenta('Remember: less combinations, less time to find your password.')}`,
      choices: [
        { name: "Yes, skip identical chars couples (e.g. aa or TT)", value: 2 },
        { name: "Yes, skip identical chars triplets (e.g. aaa or TTT)", value: 3 },
        { name: "No, check all the combinations", value: 0 },
      ],
    }
  ];

  inquirer.prompt(questions).then(answers => {
    if(typeof answers.jump !== 'undefined'){
      config.set(JUMP, answers.jump);
    }

    doBye();
  });
}

function doBye(){
  console.log(chalk.yellow(`\n\nOk, we're done with confogirations. Run:\n\t${chalk.cyan('npm start --start')}\n\n`));
}

function doConfig(){
  let questions = [
    {
      type: 'input',
      name: 'wallet',
      message: 'Type here your public wallet address (e.g. tz1...):'
    },
    {
      type: 'input',
      name: 'mnemonic',
      message: 'Type here your mnemonic words list (e.g. apples cat radio...):'
    },
    {
      type: 'list',
      name: 'passwordlist',
      message: `Can you think of a password list/matrix to try out before going to bruteforce? ${chalk.magenta('This would speed up the test very considerably.')}`,
      choices: ['Yes', 'No'],
    }
  ];

  inquirer.prompt(questions).then(answers => {
    config.set(WALLET, answers.wallet);
    config.set(MNEMONIC, answers.mnemonic);

    if(Yes(answers.passwordlist)){
      config.set(MODE, MODES.PWSEEDS);
      doPasswordSeeds();
    } else {
      config.set(MODE, MODES.BRUTEFORCE);
      doCharsetTool();
    }
  });
}

function doCheckConfig(){
  if(JSON.stringify(config.all, null, '') == '{}'){
    doConfig();
  } else {
    let questions = [
      {
        type: 'list',
        name: 'overwrite',
        message: 'A configuration is already present. Do you want to overwrite it?',
        choices: ['Yes', 'No'],
      }
    ];

    inquirer.prompt(questions).then(answers => {
      if(Yes(answers.overwrite)){
        config.all = {};
        doConfig();
      } else {
        console.log(chalk.yellow('\nConfiguration has not been edited.'));
      }
    });
  }
}

module.exports = doCheckConfig;
