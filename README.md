# wpw-sdk-nodejs
Worldpay Within SDK - Node.js

## Getting Started

### Prerequisites: 

* [Nodejs](https://nodejs.org/en/) - tested with Node.JS 8.6.0 (ubuntu) and 4.8.4 (raspberry pi)
* [npm](https://www.npmjs.com/) - tested with NPM 5.5.1 (ubuntu) and 2.5.11 (raspberry pi)

1. Clone/Download and update the repository
* `git clone https://github.com/WPTechInnovation/wpw-sdk-node`
* `cd wpw-sdk-nodejs`
* `git submodile update --init --recursive`

2. Run the following command:
`npm install`

3. In one terminal / cmd, (or on one device) run:
`node example-producer-callbacks.js`
(you can run `node example-producer.js` but this does not recall the producer, once it times out)

It will start producer application with communication on TCP port 9090 from localhost (Apache thrift communication)

4. In another terminal / cmd, (or on another device, on the same network) run:
`node example-consumer.js`

It will start consumer application with communication on TCP port 9088 from localhost (Apache thrift communication)

A payment should happen, this will be to our test online.worldpay.com account (so you can't actually see the payment)

5. Set up an [online.worldpay.com](http://www.online.worldpay.com) account (keep this in test for the time being, you won't need a live account unless you actually plan to take payment - and then you'll have to go through boarding)


### OS specific issues

On `debian` 14 default version of Node.JS is 0.10. Distributions based on it such as `respbian` and `ubuntu` would be impacted as well.
To install Node.JS 8.x:
* `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
* `sudo apt-get install -y nodejs`

To install Node.JS 4.x (Long Time Support release):
* `curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -`
* `sudo apt-get install -y nodejs`

##

Producer device advertises its services using WorldPay library.
Internally it communicates using Apache thrift and rpc-agent sends a broadcast to all nearby devices advertising its services.

Consumer device finds all nearby producers using WorldPay library.
Internally it communicates with Apache thrift and rpc-agent handles all the network communication.
After desired service is ordered, consumer makes payment using WorldPay library and communicates with WorldPay payment service provider.
Succesful payment results in a token that confirms the payment.

Producer receives and validates the payment token, then it can begin service delivery.
It doesn't need to know credit card details (as this was handled internally by the WorldPay).
