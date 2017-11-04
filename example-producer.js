process.env.NODE_CONFIG_DIR = __dirname + '/config';
process.env.NODE_ENV = 'example-producer';
var config = require('config');

var wpwithin = require('./library/wpwithin');
var wpwConstants = require('./library/constants');
var types = require('./library/types/types');
var typesConverter = require('./library/types/converter');
var client;

var host = config.get('host');
var port = config.get('port');
var logFileName = config.get('logFileName');

wpwithin.createClient(host, port, true, logFileName, function (err, response) {

    console.log("createClient.callback");
    console.log("createClient.callback.err: " + err);
    console.log("createClient.callback.response: %j", response);

    if (err == null) {

        client = response;

        setup();
    }
});

function setup() {

    client.setup("NodeJS-Device", "Sample NodeJS producer device", function (err, response) {

        console.log("setup.callback.err: " + err);
        console.log("setup.callback.response: %j", response);

        if (err == null) {

            addService();
        }
    });
}

function addService() {

    var service = new types.Service();

    service.id = 1;
    service.name = "RoboWash";
    service.description = "Car washed by robot";
    service.serviceType = "wash";

    var rwPrice = new types.Price();
    rwPrice.id = 1;
    rwPrice.description = "Car wash";
    rwPrice.unitId = 1;
    rwPrice.unitDescription = "Single wash";
    var pricePerUnit = new types.PricePerUnit();
    pricePerUnit.amount = 650;
    pricePerUnit.currencyCode = "GBP";
    rwPrice.pricePerUnit = pricePerUnit;
    service.prices = new Array();
    service.prices[0] = rwPrice;

    client.addService(service, function (err, response) {

        console.log("addService.callback");
        console.log("err: " + err);
        console.log("response: %j", response);

        if (err == null) {

            initProducer();
        }
    });
}

function initProducer() {

    var pspConfig = new Array();

    pspConfig[wpwConstants.PSP_NAME] = config.get('pspConfig.psp_name');
    pspConfig[wpwConstants.API_ENDPOINT] = config.get('pspConfig.api_endpoint');
    pspConfig[wpwConstants.HTE_PUBLIC_KEY] = config.get('pspConfig.hte_public_key');
    pspConfig[wpwConstants.HTE_PRIVATE_KEY] = config.get('pspConfig.hte_private_key');

    if (pspConfig[wpwConstants.PSP_NAME] === "worldpayonlinepayments") {

        pspConfig[wpwConstants.MERCHANT_CLIENT_KEY] = config.get('pspConfig.merchant_client_key');
        pspConfig[wpwConstants.MERCHANT_SERVICE_KEY] = config.get('pspConfig.merchant_service_key');

    } else if (pspConfig[wpwConstants.PSP_NAME] === "securenet") {

        pspConfig[wpwConstants.DEVELOPER_ID] = config.get('pspConfig.developer_id');
        pspConfig[wpwConstants.APP_VERSION] = config.get('pspConfig.app_version');
        pspConfig[wpwConstants.PUBLIC_KEY] = config.get('pspConfig.public_key');
        pspConfig[wpwConstants.SECURE_KEY] = config.get('pspConfig.secure_key');
        pspConfig[wpwConstants.SECURE_NET_ID] = config.get('pspConfig.secure_net_id');

    } else {
        console.log("pspConfig.psp_name not set in config file.");
        return;
    }

    client.initProducer(pspConfig, function (err, response) {

        console.log("initProducer.callback");
        console.log("initProducer.err: " + err);
        console.log("initProducer.response: %j", response);

        if (err == null) {

            startBroadcast();
        }
    });
}

function startBroadcast() {

    client.startServiceBroadcast(20000, function (err, response) {

        console.log("startServiceBroadcast.callback");
        console.log("startServiceBroadcast.err: " + err);
        console.log("startServiceBroadcast.response: %j", response);
    });
}
