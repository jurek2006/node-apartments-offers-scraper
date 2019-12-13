const chalk = require('chalk');
const isShowingVerboseLogsOn = true;

exports.verboseLog = message => {
  if (isShowingVerboseLogsOn) {
    console.log(chalk.yellow(`VERBOSE: ${message}`));
  }
};

exports.userLog = message => {
  console.log(chalk.blue(message));
};
