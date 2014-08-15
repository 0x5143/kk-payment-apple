kk-payment-apple
================

Node.js verification library for apple in app purchase receipts

## Installation
kk-payment-apple is available via npm

`npm install kk-payment-apple`

It has no external dependencies other than node itself.

## Overview
kk-payment-apple takes an iOS In App purchuse receipt string in it's raw string form and sends it to the Apple servers for verification, it then returns a response indicating whether the receipt is valid or not.

There are two environments for Apple's verification servers SandBox and Production, you can configure IAPVerifier to use either environment depending if you are testing your system or running it in production.

## Usage
When instantiating the verifier you need to provide the itunes shared secret for the application you are verifying receipts for.  This can be found on the itunes connect page for the applications' in app purchases.

The IAPVerifier API is very simple, create an instance of IAPVerifier and then call verifyReceipt on it with a callback.  The first argument is the receipt data string, the second is a boolean indicating whether or not the receipt data is encoded as base64 already or not (this arguments is optional, defaults to false) and the last argument is the callback which includes three parameters.

    verifyReceipt(rawReceipt, function(isValid, message, data){
      // do something with the verification info...      
    });
  
    verifyAutoRenewReceipt(rawReceipt, function(isValid, message, data){
      // do something with the verification info...
    });
    
The callback has four params sent back to it, these are:

* isValid - boolean indicating that the receipt has valid or the auto-renewing subscription is active
* statusCode - the status code returned by Apple's server
* message - the message associated in Apple's system with the statusCode
* data - the receipt data returned by Apple's server

The callback function includes isValid which indicates whether the receipt is for a valid subscription/purchase, the statusCode returned by Apple's server and the Message associated with the statusCode.

### To verify a receipt:
Javascript:
    
    var IAPVerifier = require('iap_verifier');

    // Verify a receipt
    receipt = 'raw_receipt_data_from_ios'
    
    var client = new IAPVerifier(itunes_shared_secret);
    client.verifyReceipt(receipt, function(valid, msg, data) {
      if (valid) {
        // update status of payment in your system
        console.log("Valid receipt");
      } else {
        console.log("Invalid receipt");
      }
    });
Similarly you can verify auto-renewing receipts:

Javascript:

    // Verify an auto-renewing receipt
    receipt = 'raw_receipt_data_from_ios'
    
    var client = new IAPVerifier('your_secret_key_from_itunes')
    client.verifyAutoRenewReceipt(receipt, function(valid, msg, data){
      if(valid) {
        // update status of payment in your system
      }
    });

## Special Note
### Handling App Store reviews:
There is a special case for iOS In App Purchase verification that occurs during application review.  

When you app is reviewed Apple is testing with a Distribution (production) build of your application however for testing reasons they use dns to fake out your app so that it thinks it's hitting the Production servers but is in fact hitting the Sandbox servers when processing In App purchases.  

This means when verifying receipts during a review you must failover to check receipts on the Sandbox environment, IAPVerifier does this automatically by checking the error codes sent back from Apple's server and auto-retrying the verification on the Sandbox environment if a Sandbox receipt has been sent to the Production environment.  This approach is recommended by Apple as the simplest way to handle these app store review receipts.

## LICENSE - "MIT License"

Copyright (c) 2013 云景, http://yunjing.me/

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
