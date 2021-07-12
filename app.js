//index.js
const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
var logger = require('morgan');

const allowCors = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // colocar os dominios permitidos | ex: 127.0.0.1:3000
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}
app.use(allowCors)
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(httpProxy('http://localhost:2375/', {
    proxyErrorHandler: (err, res, next) => {
        switch (err && err.code) {
            case 'ECONNRESET':
                { return res.status(405).json({ message: 'The method specified in the request is not allowed.' }); }
            case 'ECONNREFUSED':
                { return res.status(503).json({ message: 'The request was not completed. The server is temporarily overloading or down.' }); }
            default:
                { next(err); }
        }
    }
}));

app.listen(4000, () => {
    console.log('API Gateway running!');
});