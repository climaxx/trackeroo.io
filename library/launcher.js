/**
 * Launcher module. A useful module to help launching platform dependent binaries.
 * This module deals with the overhead of supported operating systems, architectures and the variety of mechanisms
 * used to launch applications on different platforms.
 * @module wpwithin/launcher
 */
module.exports = {
  startProcess : startProcess,
  stopProcess : stopProcess
};

var util = require("util");

/**
  * Stop a process
  */
function stopProcess(procHandle) {

  // Send interrupt to process
  procHandle.kill("SIGINT");
}
/**
  * Start a process
  * config the configuration of the application i.e. filenames for binaries of various platforms
  */
function startProcess(config, callback) {

  // Determine the OS and Architecture this application is currently running on
  var hostOS = detectHostOS().toLowerCase();
  var hostArchitecture = detectHostArchitecture().toLowerCase();


  if(validateConfig(config, hostOS, hostArchitecture)) {

    switch(hostOS) {

      case "darwin":
      return launchDarwin(config, callback);

      case "linux":
      return launchLinux(config, callback);

      case "win32":
      return launchWindows(config, callback);

      default:
      throw new Error(util.format("Unable to launch binary on host os (Unsupported by launcher)(HostOS=%s)", hostOS));
    }
  } else {

      throw new Error(util.format("Unable to launch binary on host - unsupported by launcher. (OS=%s)(Architecture=%s)", hostOS, hostArchitecture));
  }
}

/**
 * Determine what Operating System this application is running on
 */
function detectHostOS() {

  return process.platform;
}

/**
  * Detect the CPU Atchitecture that this application is currently running on
  **/
function detectHostArchitecture() {

  return process.arch;
}

function launchDarwin(config, callback) {

  var util = require('util');

  console.log("launching Darwin application");

  var cmd = config[detectHostOS()][detectHostArchitecture()];

  launchBinary(cmd, callback);
}

function launchLinux(config, callback) {

  console.log("launching Linux application");

  var cmd = config[detectHostOS()][detectHostArchitecture()];

  launchBinary(cmd, callback);
}

function launchWindows(config, callback) {

  console.log("launching Windows application");

  var cmd = config[detectHostOS()][detectHostArchitecture()];

  launchBinary(cmd, callback);
}
/**
 * For a given config, determine if it matches the specified hostOS and hostArchitecture
 */
function validateConfig(config, hostOS, hostArchitecture) {

  console.log("Validating OS/Architecure. (%s/%s)", hostOS, hostArchitecture);

  if(config == null) {

    return false;
  }

  var validationResult = config[hostOS] != null && config[hostOS][hostArchitecture] != null;

  console.log("Validation passed =", validationResult);

  return validationResult;
}

function launchBinary(cmd, callback) {

  console.log("Command: ", cmd);

  var exec = require('child_process').exec;

  // error - gets set if executing the program fails i.e. Exit code is non zero.
  // stdout - Standard out - result of regular print states.
  // stderr - Error out - result of spending

  return exec(cmd, function(error, stdout, stderr) {

      callback(error, stdout, stderr);
  });
}
