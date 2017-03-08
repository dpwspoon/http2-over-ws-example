const http = require('http');
const hostname = 'localhost';
const port = 8001;
const http2port = 8002;
const http2 = require('http2');
const websocket = require('websocket-stream');

var DataService = require('./periodic-updating-data');

var ds = new DataService();
ds.start();

// plain http service
const server = http.createServer(function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(ds.getScore());
});

server.listen(port, hostname, function () {
    console.log('Server running at http://' + hostname + ":" + port + "/");
});

// http2 push rest server over ws
var http2server = http2.raw.createServer({
    transport: function(options, start){
        var httpServer = http.createServer();
        options.server = httpServer;
        var res = websocket.createServer(options, start);
        res.listen = function(options, cb){
            httpServer.listen(options, cb);
        };
        return res;
    }
}, function (request, response) {
    // Keep response open
    response.setHeader('Content-Type', 'text/html; charset=UTF-8');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.write('ping');

    var prevPush;

    ds.on('score', function () {
        if (prevPush != null) {
            try {
                prevPush.end();
            } catch (e) {
                console.log("warn: error closing prev push: " + e);
            }
        }
        var pushResponse = response.push(
            {
                path: 'scores'
            }
        );

        var message = ds.getScore();
        pushResponse.setHeader('Content-Type', 'text/html');
        pushResponse.setHeader('Content-Length', message.length);
        pushResponse.setHeader('Cache-Control', 'private, max-age=0');
        pushResponse.write(message);
        prevPush = pushResponse;
    });
});

http2server.listen(http2port);
http2server.listen(http2port, function () {
    console.log('HTTP2/WS Server running at ws://' + hostname + ":" + http2port + "/");
});