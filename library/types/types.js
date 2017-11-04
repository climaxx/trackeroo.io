module.exports = {
  Error : Error,
  Service : Service,
  Price : Price,
  PricePerUnit : PricePerUnit,
  HCECard : HCECard,
  Device : Device,
  ServiceMessage : ServiceMessage,
  ServiceDetails : ServiceDetails,
  TotalPriceResponse : TotalPriceResponse,
  PaymentResponse : PaymentResponse,
  ServiceDeliveryToken : ServiceDeliveryToken
};

function Error() {

  var message;
}

function Service() {

  var id;
  var name;
  var description;
  var serviceType;
  var prices;
}

function Price() {

  var id;
  var description;
  var pricePerUnit;
  var unitId;
  var unitDescription;
}

function PricePerUnit() {

  var amount;
  var currencyCode;
}

function HCECard() {

  var firstName;
  var lastName;
  var expMonth;
  var expYear;
  var cardNumber;
  var type;
  var cvc;
}

function Device() {

  var uid;
  var name;
  var description;
  var services;
  var ipv4Address;
  var currencyCode;
}

function ServiceMessage() {

  var deviceDescription;
  var hostname;
  var portNumber;
  var serverId;
  var urlPrefix;
  var scheme;
  var serviceTypes;
}

function ServiceDetails() {

  var serviceId;
  var serviceDescription;
}

function TotalPriceResponse() {

  var serverId;
  var clientId;
  var priceId;
  var unitsToSupply;
  var totalPrice;
  var paymentReferenceId;
  var merchantClientKey;
  var currencyCode;
}

function PaymentResponse() {

  var serverId;
  var clientId;
  var totalPaid;
  var serviceDeliveryToken;
}

function ServiceDeliveryToken() {

  var key;
  var issued;
  var expiry;
  var refundOnExpiry;
  var signature;
}
