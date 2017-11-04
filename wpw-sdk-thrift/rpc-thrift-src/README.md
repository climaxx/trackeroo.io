# Worldpay Within SDK RPC

Apache Thrift is used to generate an interface between the WPWithin SDK written in Go and other programming languages.

More information at https://thrift.apache.org and https://en.wikipedia.org/wiki/Apache_Thrift

If you plan on modifying the Thrift layer of this application it may be worth looking at the index of [Thrift tutorials](https://thrift.apache.org/tutorial/) if you have not already done so.

### wpwithin.thrift

This file defines the services functions that can be called via Thrift. These functions map onto `wpwithin.go` in the `sdkcore\wpwithin` directory at the root of this repository.

### wptypes.thrift

The types referred to in wpwithin.thrift are stored here.

### Code generation

If you intent to generate thrift client/server code then you may need to specify a namespace at the top of both files.
