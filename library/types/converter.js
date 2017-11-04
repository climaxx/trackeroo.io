var wpthrift_types = require('../wpwithin-thrift/wptypes_types');

module.exports = {
    toThrift: toThrift,
    fromThrift: fromThrift
};

function fromThrift() {

    return new constructFromThrift();
}

function toThrift() {

    return new constructToThrift();
}

function constructFromThrift() {

    var types = require('./types');

    this.error = function (error) {

        result = new types.Error();
        result.message = error.message;

        return result;
    };

    this.service = function (service) {

        result = new types.Service();
        result.id = service.id;
        result.name = service.name;
        result.description = service.description;
        result.prices = service.prices;
        if(serviceMessage.hasAttribute("serviceTypes") && serviceMessage.serviceTypes !== null) {
             result.serviceTypes = serviceMessage.serviceTypes;
        }

        return result;
    };

    this.price = function (price) {

        result = new types.Price();
        result.id = price.id;
        result.description = price.description;
        result.pricePerUnit = price.pricePerUnit;
        result.unitId = price.unitId;
        result.unitDescription = price.unitDescription;

        return result;
    };

    this.pricePerUnit = function (pricePerUnit) {

        result = new types.PricePerUnit();
        result.amount = pricePerUnit.amount;
        result.currencyCode = pricePerUnit.currencyCode;

        return result;
    };

    this.hceCard = function (hceCard) {
        'use strict';

        var result = new types.HCECard();
        result.firstName = hceCard.firstName;
        result.lastName = hceCard.lastName;
        result.expMonth = hceCard.expMonth;
        result.expYear = hceCard.expYear;
        result.type = hceCard.type;
        result.cvc = hceCard.cvc;

        return result;
    };

    this.device = function (device) {
        'use strict';

        var result = new types.Device();
        result.uid = device.uid;
        result.name = device.name;
        result.description = device.description;
        result.services = device.services;
        result.ipv4Address = device.ipv4Address;
        result.currencyCode = result.currencyCode;

        return result;
    };

    this.serviceMessage = function (serviceMessage) {

        result = new types.ServiceMessage();
        result.deviceDescription = serviceMessage.deviceDescription;
        result.hostname = sericeMessage.hostname;
        result.portNumber = serviceMessage.portNumber;
        result.serverId = serviceMessage.serverId;
        result.urlPrefix = serviceMessage.urlPrefix;
        result.scheme = serviceMessage.scheme;

        return result;
    };

    this.serviceDetails = function (serviceDetails) {

        result = new types.ServiceDetails();
        result.serviceId = serviceDetails.serviceId;
        result.serviceDescription = serviceDetails.serviceDescription;

        return result;
    };

    this.totalPriceResponse = function (totalPriceResponse) {

        result = new types.TotalPriceResponse();
        result.serverId = totalPrice.serverId;
        result.clientId = totalPrice.clientId;
        result.priceId = totalPrice.priceId;
        result.unitsToSupply = totalPriceResponse.unitsToSupply;
        result.totalPrice = totalPriceResponse.totalPrice;
        result.paymentReferenceId = totalPriceResponse.paymentReferenceId;
        result.merchantClientKey = totalPriceResponse.merchantClientKey;
        result.currencyCode = totalPriceResponse.currencyCode;

        return result;
    };

    this.paymentResponse = function (paymentResponse) {

        result = new types.PaymentResponse();
        result.serverId = paymentResponse.serverId;
        result.clientId = paymentResponse.clientId;
        result.totalPaid = paymentResponse.totalPaid;
        result.serviceDeliveryToken = paymentResponse.serviceDeliveryToken;

        return result;
    };

    this.serviceDeliveryToken = function (sdt) {

        result = new types.ServiceDeliveryToken();
        result.key = sdt.key;
        result.issued = sdt.issued;
        result.expiry = sdt.expiry;
        result.refundOnExpiry = sdt.refundOnExpiry;
        result.signature = sdt.signature;

        return result;
    };
}

function constructToThrift() {

    this.error = function (error) {

        result = new wpthrift_types.Error();
        result.message = error.message;

        return result;
    };

    this.service = function (service) {

        var result = new wpthrift_types.Service();
        result.id = service.id;
        result.name = service.name;
        result.description = service.description;
        result.serviceType = service.serviceType;

        var tPrices = new Array();

        for (var i = 0; i < service.prices.length; i++) {

            tPrices[i] = this.price(service.prices[i]);
        }

        result.prices = tPrices;

        return result;
    };

    this.price = function (price) {

        var result = new wpthrift_types.Price();
        result.id = price.id;
        result.description = price.description;
        result.pricePerUnit = this.pricePerUnit(price.pricePerUnit);
        result.unitDescription = price.unitDescription;
        result.unitId = price.unitId;

        return result;
    };

    this.pricePerUnit = function (pricePerUnit) {

        var result = new wpthrift_types.PricePerUnit();
        result.amount = pricePerUnit.amount;
        result.currencyCode = pricePerUnit.currencyCode;

        return result;
    };

    this.hceCard = function (hceCard) {
        'use strict';

        var result = new wpthrift_types.HCECard();
        result.firstName = hceCard.firstName;
        result.lastName = hceCard.lastName;
        result.expMonth = hceCard.expMonth;
        result.expYear = hceCard.expYear;
        result.cardNumber = hceCard.cardNumber;
        result.type = hceCard.type;
        result.cvc = hceCard.cvc;

        return result;
    };

    this.device = function (device) {

        result = new wpthrift_types.Device();
        result.uid = device.uid;
        result.name = device.name;
        result.description = device.description;
        result.services = device.services;
        result.ipv4Address = device.ipv4Address;
        result.currencyCode = result.currencyCode;

        return result;
    };

    this.serviceMessage = function (serviceMessage) {

        result = new wpthrift_types.ServiceMessage();
        result.deviceDescription = serviceMessage.deviceDescription;
        result.hostname = serviceMessage.hostname;
        result.portNumber = serviceMessage.portNumber;
        result.serverId = serviceMessage.serverId;
        result.urlPrefix = serviceMessage.urlPrefix;
        result.scheme = serviceMessage.scheme;
        result.serviceTypes = serviceMessage.serviceTypes;

        return result;
    };

    this.serviceDetails = function (serviceDetails) {

        result = new wpthrift_types.ServiceDetails();
        result.serviceId = serviceDetails.serviceId;
        result.serviceDescription = serviceDetails.serviceDescription;

        return result;
    };

    this.totalPriceResponse = function (totalPriceResponse) {

        result = new wpthrift_types.TotalPriceResponse();
        result.serverId = totalPriceResponse.serverId;
        result.clientId = totalPriceResponse.clientId;
        result.priceId = totalPriceResponse.priceId;
        result.unitsToSupply = totalPriceResponse.unitsToSupply;
        result.totalPrice = totalPriceResponse.totalPrice;
        result.paymentReferenceId = totalPriceResponse.paymentReferenceId;
        result.merchantClientKey = totalPriceResponse.merchantClientKey;
        result.currencyCode = totalPriceResponse.currencyCode;

        return result;
    };

    this.paymentResponse = function (paymentResponse) {

        result = new wpthrift_types.PaymentResponse();
        result.serverId = paymentResponse.serverId;
        result.clientId = paymentResponse.clientId;
        result.totalPaid = paymentResponse.totalPaid;
        result.serviceDeliveryToken = paymentResponse.serviceDeliveryToken;

        return result;
    };

    this.serviceDeliveryToken = function (sdt) {

        result = new wpthrift_types.ServiceDeliveryToken();
        result.key = sdt.key;
        result.issued = sdt.issued;
        result.expiry = sdt.expiry;
        result.refundOnExpiry = sdt.refundOnExpiry;
        result.signature = sdt.signature;

        return result;
    };
}
