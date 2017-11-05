process.env.NODE_CONFIG_DIR= __dirname +'/config';
process.env.NODE_ENV = 'example-producer-callbacks';
var config = require('config');

var wpwithin = require('./library/wpwithin');
var wpwConstants = require('./library/constants');
var types = require('./library/types/types');
var typesConverter = require('./library/types/converter');

var eventListener = {
    beginServiceDelivery: function (clientId, servicePriceId, serviceDeliveryToken, unitsToSupply, callback) {

        console.log("Node js event:: beginServiceDelivery");

        console.log("clientId: %s", clientId);
        console.log("Service price Id: %s", servicePriceId);
        console.log("unitsToSupply: %d", unitsToSupply);
        console.log("serviceDeliveryToken: %j", serviceDeliveryToken);

    },
    endServiceDelivery: function (clientId, serviceDeliveryToken, unitsReceived, callback) {

        console.log("Node js event:: endServiceDelivery");

        console.log("clientId: %s", clientId);
        console.log("unitsToSupply: %d", unitsReceived);
        console.log("serviceDeliveryToken: %j", serviceDeliveryToken);
    },
    serviceDiscoveryEvent: function (remoteAddr, callback) {

        console.log("Node js event: serviceDiscoveryEvent");
        console.log("remoteAddr: %s", remoteAddr);
    },

    servicePricesEvent: function (remoteAddr, serviceId, callback) {
        console.log("Node js event: servicePricesEvent");
        console.log("selected serviceId: %s", serviceId);
        console.log("remoteAddr: %s", remoteAddr);
    },

    serviceTotalPriceEvent: function (remoteAddr, serviceId, totalPriceResp) {
        console.log("Node js event: serviceTotalPriceEvent");
        console.log("selected serviceId: %s", serviceId);
        console.log("remoteAddr: %s", remoteAddr);
        console.log("tpr: %s", totalPriceResp);
    },

    makePaymentEvent: function (totalPrice, orderCurrency, clientToken, orderDescription, uuid) {
        console.log("Node js event: makePaymentEvent");
        console.log("uuid: %s", uuid);
        console.log("totalPrice: %s", totalPrice);
        console.log("orderCurrency: %s", orderCurrency);
        console.log("clientToken: %s", clientToken);
    },

    errorEvent: function (msg) {
        console.log("Error event msg: %s", msg);
    }

};

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

}, eventListener, 9092);

function setup() {

    client.setup("Trackeroo", "Sample NodeJS producer device", function (err, response) {

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
    rwPrice.description = "On Time Bonus";
    rwPrice.unitId = 1;
    rwPrice.unitDescription = "Bonus for coming to work on time";
    var pricePerUnit = new types.PricePerUnit();
    pricePerUnit.amount = 100;
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

    console.log("Attempting to start broadcasting...");
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

    client.startServiceBroadcast(0, function (err, response) {

        console.log("startServiceBroadcast.callback");
        console.log("startServiceBroadcast.err: " + err);
        console.log("startServiceBroadcast.response: %j", response);
    });
}
