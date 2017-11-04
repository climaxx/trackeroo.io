module.exports = {
  startRPC : startRPC
};

function startRPC(port, callback) {

  var launcher = require('./launcher');

  reqOS = ["darwin", "win32", "linux"];
  reqArch = ["x64", "ia32"];

  cfg = new launcher.Config(reqOS, reqArch);

  launcher.launch(cfg, "./libraries/iot-core-component", "-configfile conf.json -port " + port, function(err, stdout, stderr){

    console.log("StartRPC.err: ", err);
    console.log("StartRPC.strdout: ", stdout);
    console.log("StartRPC.stderr: ", stderr);

    callback(err, stderr);
  });
}

function stopRPC() {

  throw new Error("Not implemented..");
}
