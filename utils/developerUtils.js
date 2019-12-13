const isShowingVerboseLogsOn = true;

exports.verboseLog = message => {
  if (isShowingVerboseLogsOn) {
    console.log(`VERBOSE: ${message}`);
  }
};

exports.userLog = message => {
  console.log(message);
};
