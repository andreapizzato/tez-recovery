function doHelp(){
  console.log('Welcome to Tezos Wallet Recovery tool.\n');
  console.log('You should run this app with the command:\n');
  console.log('\n\t\tnpm start [action]\n\n');
  console.log('where [action] should be replaced with one og the folloing:');
  console.log('   test\t\tA light command to check for tez-recovery being fine.');
  console.log('   config\tUse this to configure the recovery process.');
  console.log('   recovery\tStart the configured recovery process!');
  console.log('   help\t\tA simple command to see this small guide again.');
}

module.exports = doHelp;
