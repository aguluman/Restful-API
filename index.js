/*
    =>Primary file for API
*/

//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./lib/config');
var fs = require('fs');
var handlers = require('./lib/handlers'); 
var helpers = require('./lib/helpers');


// Instantiating the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req,res);
});

//Start the server
httpServer.listen(config.httpPort, function () {
    console.log("The server is listening on port "+config.httpPort);
});

// Instantiate the HTTPS server 
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function (req, res) {
    unifiedServer(req,res);
});

//Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log("The server is listening on port "+config.httpsPort);
});

//All the server logic for both the http and https server
var unifiedServer = function(req,res){
    
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url, true);

    //Get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, ''); //this regualr expression is done to removes excess (//) from the url address

    //Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    var method = req.method.toLowerCase();

    //Get the headers as an object
    var headers = req.headers;

    //Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data)
    });
    req.on('end', function () {
        buffer += decoder.end();

        //Choose the handler this request should go to. If one is not found, use the notFound handler.
        var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //Construct the data object to send to the handler
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        //Route the request to the handler specified in the router
        chosenHandler(data, function (stausCode, payload) {
            //Use the status code called back by the handler, or default ot 200
            statusCode = typeof (statusCode) == 'number' ? stausCode : 200;

            //Use the payload called back by the handler, or default to an empty object
            payload = typeof (payload) == 'object' ? payload : {};

            //Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-type', 'appliction/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            //log the request path
            console.log('Returning ths response: ', stausCode, payloadString);
        });

    });
};


//Define a request router
var router = {
    'ping': handlers.ping,
    'users': handlers.users
};