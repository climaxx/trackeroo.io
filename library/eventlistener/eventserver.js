module.exports = {
    EventServer: EventServer
};

function EventServer() {

    this.start = fnStartServer;
}

var fnStartServer = function (listener, port) {

    var thrift = require('thrift');
    var wpCallbackServer = require('../wpwithin-thrift/WPWithinCallback');

    var server = thrift.createServer(wpCallbackServer, listener);

    server.listen(port);
};
