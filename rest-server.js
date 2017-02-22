const http = require('http');

const hostname = 'localhost';
const port = 8001;

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

