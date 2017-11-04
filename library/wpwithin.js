var util = require('util');
var thrift = require('thrift');
var wpwithinThrift = require('./wpwithin-thrift/WPWithin');
var eventServer = require('./eventlistener/eventserver');
var path = require('path');

module.exports = {
    createClient: createClient
};

function WPWithin(thriftClient) {

    this.converter = require('./types/converter');

    this.thriftClient = thriftClient;

    this.setup = fnSetup;
    this.addService = fnAddService;
    this.removeService = fnRemoveService;
    this.initConsumer = fnInitConsumer;
    this.initProducer = fnInitProducer;
    this.getDevice = fnGetDevice;
    this.startServiceBroadcast = fnStartServiceBroadcast;
    this.stopServiceBroadcast = fnStopServiceBroadcast;
    this.deviceDiscovery = fnDeviceDiscovery;
    this.searchForDevice = fnSearchForDevice;
    this.requestServices = fnRequestServices;
    this.getServicePrices = fnGetServicePrices;
    this.selectService = fnSelectService;
    this.makePayment = fnMakePayment;
    this.beginServiceDelivery = fnBeginServiceDelivery;
    this.endServiceDelivery = fnEndServiceDelivery;
    this.closeRPCAgent = fnCloseRPCAgent;

}

var fnSetup = function (name, description, callback) {

    this.thriftClient.setup(name, description, function (err, response) {

        callback(err, response);
    });
};

var fnAddService = function (service, callback) {

    var convSvc = this.converter.toThrift().service(service);

    this.thriftClient.addService(convSvc, function (err, result) {

        callback(err, result);
    });
};

var fnRemoveService = function (service, callback) {

    var convSvc = this.converter.toThrift().service(service);

    this.thriftClient.removeService(convSvc, function (err, result) {

        callback(err, result);
    });
};

var fnInitConsumer = function (scheme, hostname, port, urlPrefix, serverId, hceCard, pspConfig, callback) {

    tHCECard = this.converter.toThrift().hceCard(hceCard);

    this.thriftClient.initConsumer(scheme, hostname, port, urlPrefix, serverId, tHCECard, pspConfig, function (err, result) {

        callback(err, result);
    });
};

var fnInitProducer = function (pspConfig, callback) {

    this.thriftClient.initProducer(pspConfig, function (err, result) {

        callback(err, result);
    });
};

var fnGetDevice = function (callback) {

    this.thriftClient.getDevice(function (err, result) {

        callback(err, result);
    });
};

var fnStartServiceBroadcast = function (timeoutMillis, callback) {

    this.thriftClient.startServiceBroadcast(timeoutMillis, function (err, result) {

        callback(err, result);
    });
};

var fnStopServiceBroadcast = function (callback) {

    this.thriftClient.stopServiceBroadcast(function (err, result) {

        callback(err, result);
    });
};

var fnDeviceDiscovery = function (timeoutMillis, callback) {

    this.thriftClient.deviceDiscovery(timeoutMillis, function (err, response) {

        callback(err, response);
    });
};

var fnSearchForDevice = function (timeoutMillis, deviceName, callback) {

    this.thriftClient.searchForDevice(timeoutMillis, deviceName, function (err, response) {

        callback(err, response);
    });
};

var fnRequestServices = function (callback) {

    this.thriftClient.requestServices(function (err, result) {

        callback(err, result);
    });
};

var fnGetServicePrices = function (serviceId, callback) {

    this.thriftClient.getServicePrices(serviceId, function (err, result) {

        callback(err, result);
    });
};

var fnSelectService = function (serviceId, numberOfUnits, priceId, callback) {

    this.thriftClient.selectService(serviceId, numberOfUnits, priceId, function (err, result) {

        callback(err, result);
    });
};

var fnMakePayment = function (request, callback) {

    var convRequest = this.converter.toThrift().totalPriceResponse(request);

    this.thriftClient.makePayment(convRequest, function (err, result) {

        callback(err, result);
    });
};

var fnBeginServiceDelivery = function (serviceId, serviceDeliveryToken, unitsToSupply, callback) {

    this.thriftClient.beginServiceDelivery(serviceId, serviceDeliveryToken, unitsToSupply, function (err, result) {

        callback(err, result);
    });
};

var fnEndServiceDelivery = function (serviceId, serviceDeliveryToken, unitsReceived, callback) {

    this.thriftClient.endServiceDelivery(serviceId, serviceDeliveryToken, unitsReceived, function (err, result) {

        callback(err, result);
    });
};

var fnCloseRPCAgent = function (callback) {

    this.thriftClient.CloseRPCAgent(function (err, result) {

        callback(err, result);
    });
};

// Factory setup WPWithinClient
// Should return an instance of WPWithin
function createClient(host, port, startRPCAgent, callback) {

    createClient(host, port, startRPCAgent, callback, null, 0);
}

// Factory setup WPWithinClient
// Should return an instance of WPWithin
function createClient(host, port, startRPC, logFileName, callback, eventListener, callbackPort) {

    try {

        // First, we validate the callback parameters. There are two and both need to be set
        // to setup the callback server.
        if (eventListener != null) {

            // If eventListener is set, then need to validate the port
            if (callbackPort <= 0 || callbackPort > 65535) {

                callback(util.format("callbackPort (%d) is invalid should be > 0 and <= 65535", callbackPort), null);

                return;
            }

            new eventServer.EventServer().start(eventListener, callbackPort);

        } else {

            // So the event listener is not set, meaning the developer doesn't want any feedback of events
            // in this case there is no need start the callback server. We can do this by setting the port to 0
            callbackPort = 0;
        }

        if (startRPC) {

            launchRPCAgent(port, callbackPort, logFileName, function (error, stdout, stderr) {

                if (error == null) {

                    createThriftClient(host, port, callback);
                } else {

                    var strErr = util.format("%s \n %s", error, stderr);

                    callback(strErr, null);
                }
            });

        } else {

            createThriftClient(host, port, callback);
        }
    } catch (err) {

        console.log("Caught error: %s", err);

        callback(err, null);
    }
}

function launchRPCAgent(port, callbackPort, logFileName, callback) {

    var launcher = require('./launcher');

    var flagLogFile = logFileName;
    var flagLogLevels = "debug,error,info,warn,fatal";
    var flagCallbackPort = callbackPort > 0 ? "-callbackport=" + callbackPort : "";
    var binBase = process.env.WPW_HOME == "" || process.env.WPW_HOME == undefined ? path.normalize("./library/iot-core-component/bin") : process.env.WPW_HOME + path.sep + "bin";

    var config = {
        "win32": {
            "x64": util.format("%s" + path.sep + "rpc-agent-windows-amd64.exe -port=%d -logfile=%s -loglevel=%s %s", binBase, port, flagLogFile, flagLogLevels, flagCallbackPort),
            "ia32": util.format("%s" + path.sep + "rpc-agent-windows-386.exe -port=%d -logfile=%s -loglevel=%s %s", binBase, port, flagLogFile, flagLogLevels, flagCallbackPort),
            "arm": null
        },
        "darwin": {
            "x64": util.format("%s" + path.sep + "rpc-agent-darwin-amd64 -port %d -logfile %s -loglevel %s %s", binBase, port, flagLogFile, flagLogLevels, flagCallbackPort),
            "ia32": util.format("%s" + path.sep + "rpc-agent-darwin-386 -port %d -logfile %s -loglevel %s %s", binBase, port, flagLogFile, flagLogLevels, flagCallbackPort),
            "arm": null
        },
        "linux": {
            "x64": util.format("%s" + path.sep + "rpc-agent-linux-amd64 -port %d -logfile %s -loglevel %s %s", binBase, port, flagLogFile, flagLogFile, flagCallbackPort),
            "ia32": util.format("%s" + path.sep + "rpc-agent-linux-386 -port %d -logfile %s -loglevel %s %s", binBase, port, flagLogFile, flagLogFile, flagCallbackPort),
            "arm": util.format("%s" + path.sep + "rpc-agent-linux-arm32 -port %d -logfile %s -loglevel %s %s", binBase, port, flagLogFile, flagLogFile, flagCallbackPort),
        }
    };

    var launchCallback = function (error, stdout, stderr) {

        console.log("-------------Launcher Process Event-------------");
        console.log("error: " + error);
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        console.log("------------------------------------------------");

        callback(error, stdout, stderr);
    };

    launcher.startProcess(config, launchCallback);

    var sleep = require('system-sleep');
    sleep(750);
    callback(null, null, null);
}

// Create a WPWithin Thrift client
function createThriftClient(host, port, callback) {

    transport = thrift.TBufferedTransport;
    protocol = thrift.TBinaryProtocol;

    var connection = thrift.createConnection(host, port);

    connection.on('error', function (err) {

        callback(err, null);
    });

    client = thrift.createClient(wpwithinThrift, connection);

    callback(null, new WPWithin(client));
}
