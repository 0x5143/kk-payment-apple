/**
 * IAPVerifier warps the calls necessary to verify In App Purchase receipts from iOS with Apple's servers.
 *
 * Using IAPVerifier you can verify typical IAP receipts and Auto-renewing receipts using the two functions available:
 *   verifyReceipt
 *   verifyAutoRenewReceipt
 *
 * PRODUCTION: https://buy.itunes.apple.com/verifyReceipt
 * SANDBOX: https://sandbox.itunes.apple.com/verifyReceipt
 *
 * Verify a receipt
 *  receipt = '{
 *      "signature" = "AluGxOuMy+RT1gkyFCoD1i1KT3KUZl+F5FAAW0ELBlCUbC9dW14876aW0OXBlNJ6pXbBBFB8K0LDy6LuoAS8iBiq3529aRbVRUSKCPeCDZ7apC2zqFYZ4N7bSFDMeb92wzN0X/dELxlkRH4bWjO67X7gnHcN47qHoVckSlGo/mpbAAADVzCCA1MwggI7oAMCAQICCGUUkU3ZWAS1MA0GCSqGSIb3DQEBBQUAMH8xCzAJBgNVBAYTAlVTMRMwEQYDVQQKDApBcHBsZSBJbmMuMSYwJAYDVQQLDB1BcHBsZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eTEzMDEGA1UEAwwqQXBwbGUgaVR1bmVzIFN0b3JlIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTA5MDYxNTIyMDU1NloXDTE0MDYxNDIyMDU1NlowZDEjMCEGA1UEAwwaUHVyY2hhc2VSZWNlaXB0Q2VydGlmaWNhdGUxGzAZBgNVBAsMEkFwcGxlIGlUdW5lcyBTdG9yZTETMBEGA1UECgwKQXBwbGUgSW5jLjELMAkGA1UEBhMCVVMwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAMrRjF2ct4IrSdiTChaI0g8pwv/cmHs8p/RwV/rt/91XKVhNl4XIBimKjQQNfgHsDs6yju++DrKJE7uKsphMddKYfFE5rGXsAdBEjBwRIxexTevx3HLEFGAt1moKx509dhxtiIdDgJv2YaVs49B0uJvNdy6SMqNNLHsDLzDS9oZHAgMBAAGjcjBwMAwGA1UdEwEB/wQCMAAwHwYDVR0jBBgwFoAUNh3o4p2C0gEYtTJrDtdDC5FYQzowDgYDVR0PAQH/BAQDAgeAMB0GA1UdDgQWBBSpg4PyGUjFPhJXCBTMzaN+mV8k9TAQBgoqhkiG92NkBgUBBAIFADANBgkqhkiG9w0BAQUFAAOCAQEAEaSbPjtmN4C/IB3QEpK32RxacCDXdVXAeVReS5FaZxc+t88pQP93BiAxvdW/3eTSMGY5FbeAYL3etqP5gm8wrFojX0ikyVRStQ+/AQ0KEjtqB07kLs9QUe8czR8UGfdM1EumV/UgvDd4NwNYxLQMg4WTQfgkQQVy8GXZwVHgbE/UC6Y7053pGXBk51NPM3woxhd3gSRLvXj+loHsStcTEqe9pBDpmG5+sk4tw+GK3GMeEN5/+e1QT9np/Kl1nj+aBw7C0xsy0bFnaAd1cSS6xdory/CUvM6gtKsmnOOdqTesbp0bs8sn6Wqs0C9dgcxRHuOMZ2tm8npLUm7argOSzQ==";
 *      "purchase-info" = "ewoJInF1YW50aXR5IiA9ICIxIjsKCSJwdXJjaGFzZS1kYXRlIiA9ICIyMDExLTEwLTEyIDIwOjA1OjUwIEV0Yy9HTVQiOwoJIml0ZW0taWQiID0gIjQ3MjQxNTM1MyI7CgkiZXhwaXJlcy1kYXRlLWZvcm1hdHRlZCIgPSAiMjAxMS0xMC0xMiAyMDoxMDo1MCBFdGMvR01UIjsKCSJleHBpcmVzLWRhdGUiID0gIjEzMTg0NTAyNTAwMDAiOwoJInByb2R1Y3QtaWQiID0gImNvbS5kYWlseWJ1cm4ud29kMW1vbnRoIjsKCSJ0cmFuc2FjdGlvbi1pZCIgPSAiMTAwMDAwMDAwOTk1NzYwMiI7Cgkib3JpZ2luYWwtcHVyY2hhc2UtZGF0ZSIgPSAiMjAxMS0xMC0xMiAyMDowNTo1MiBFdGMvR01UIjsKCSJvcmlnaW5hbC10cmFuc2FjdGlvbi1pZCIgPSAiMTAwMDAwMDAwOTk1NzYwMiI7CgkiYmlkIiA9ICJjb20uZGFpbHlidXJuLndvZCI7CgkiYnZycyIgPSAiMC4wLjgiOwp9";
 *      "environment" = "Sandbox";
 *      "pod" = "100";
 *      "signing-status" = "0";
 *  }'
 *
 *  client = new IAPVerifier('e9a418ff1b2d42a2bc5c4f9b294555df', true)
 *  client.verifyAutoRenewReceipt receipt, (valid, msg, data) ->
 *      if valid
 *          console.log("Valid receipt")
 *      else
 *          console.log("Invalid receipt")
 *
 *      console.log("Callback: #{data.status} | #{msg}")
 *
 */

var https = require('https');

var kProductionHost = "buy.itunes.apple.com";
var kSandboxHost = "sandbox.itunes.apple.com";
var kResponseCodes = {
    0 : {
        message : "Active",
        valid : true,
        error : false
    },
    21000 : {
        message : "App store could not read",
        valid : false,
        error : true
    },
    21002 : {
        message : "Date was malformed",
        valid : false,
        error : true
    },
    21003 : {
        message : "Receipt not authenticated",
        valid : false,
        error : true
    },
    21004 : {
        message : "Shared secret does not match",
        valid : false,
        error : true
    },
    21005 : {
        message : "Receipt server unavailable",
        valid : false,
        error : true
    },
    21006 : {
        message : "Receipt valid but sub expired",
        valid : false,
        error : false
    },
    21007 : {
        message : "Sandbox receipt sent to Production environment",
        valid : false,
        error : true,
        redirect : true
    },
    21008 : {
        message : "Production receipt sent to Sandbox environment",
        valid : false,
        error : true
    }
};

function IAPVerifier(conf) {
    this.production = conf.production || false;
    this.debug = conf.debug || false;
    this.host = this.production ? kProductionHost : kSandboxHost;
    this.port = 443;
    this.path = '/verifyReceipt';
    this.method = 'POST';
}

/**
 * verifyAutoRenewReceipt
 *
 * Verifies an In App Purchase receipt string for an auto-renewing subscription against Apple's servers
 *
 * Auto-renewing subscriptions can return a larger number of responses, in the event that the response is 21007
 * the function will auto-retry to process the receipt against the Sandbox environment.
 *
 * The 21007 status code is indicative of what will happen when the App Store Review team is trying to test a subscription while reviewing an application
 * 
 * @param {String} receipt      - the receipt string
 * @param {Function} cb         -  callback function that will return the status code and results for the verification call
 */
IAPVerifier.prototype.verifyAutoRenewReceipt = function(receipt, cb) {
    var data = {
        'receipt-data' : ""
    };
    return this.verifyWithRetry(data, receipt, cb);
};

/**
 * verifyReceipt
 * Verifies an In App Purchase receipt string against Apple's servers
 * params:
 *  receipt     - the receipt string
 *  cb            - callback function that will return the status code and results for the verification call
 */
IAPVerifier.prototype.verifyReceipt = function(receipt, cb) {
    var data = {
        'receipt-data' : ""
    };
    return this.verifyWithRetry(data, receipt, cb);
};

/**
 * verifyWithRetry
 * Verify with retry will automatically call the Apple Sandbox verification server in the event that a 21007 error code is returned.
 * This error code is an indication that the app may be receiving app store review requests.
 */
IAPVerifier.prototype.verifyWithRetry = function(receiptData, receipt, cb) {
    var self = this;
    return this.verify(receiptData, receipt, this.requestOptions(), function(valid, msg, data) {
        if ((21007 === data.status) && (self.productionHost === self.host)) {
            if (self.debug) {
                console.log("Retry on Sandbox");
            }
            var options = self.requestOptions();
            options.host = self.sandboxHost;
            return self.verify(receiptData, receipt, options, function(valid, msg, data) {
                if (self.debug) {
                    console.log("STATUS " + data.status);
                }
                return cb(valid, msg, data);
            });
        } else {
            if (self.debug) {
                console.log("else");
            }
            return cb(valid, msg, data);
        }
    });
};

/**
 * verify the receipt data
 */
IAPVerifier.prototype.verify = function(data, receipt, options, cb) {
    var self = this;
    if (self.debug) {
        console.log("verify!");
    }
    //var buffer = new Buffer(receipt);
    //var encoded = buffer.toString('base64');
    //data['receipt-data'] = encoded;
    data['receipt-data'] = receipt;
    var post_data = JSON.stringify(data);
    options.headers = {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length' : post_data.length
    };
    var request = https.request(options, function(response) {
        if (self.debug) {
            console.log('status Code: ' + response.statusCode);
            console.log('headers : ' + response.headers);
        }
        return response.on('data', function(data) {
            if (self.debug) {
                console.log('data' + data);
            }
            if (response.statusCode !== 200) {
                if (self.debug) {
                    console.log('error : ' + data);
                }
                return cb(false, data);
            }
            var responseData = JSON.parse(data);
            return self.processStatus(responseData, cb);
        });
    });
    request.write(post_data);
    request.end();
    return request.on('error', function(err) {
        if (this.debug) {
            return console.log("In App purchase verification error: " + err);
        }
    });
};

IAPVerifier.prototype.processStatus = function(data, cb) {
    if (this.debug) {
        console.log('Process status ' + data.status);
    }
    var response = kResponseCodes[data.status];
    if (!response) {
        response = {
            valid : false,
            error : true,
            message : "Unknown status code: " + data.status
        };
    }
    return cb(response.valid, response.message, data);
};

IAPVerifier.prototype.requestOptions = function() {
    var options = {
        host : this.host,
        port : this.port,
        path : this.path,
        method : this.method
    };
    return options;
};

module.exports = IAPVerifier;
