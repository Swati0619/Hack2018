const express = require('express');
var app = express();
const log4js = require('log4js')
var twitterRouter = require('./api/routers/twitterRouter')
const chartRouter = require('./api/routers/chartRouter')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use((req, res, next) => {
    console.log("Inside app use ")
    console.log(req.get("headers"));
    //   res.header("Access-Control-Allow-Origin", "*");
    //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    console.log("Inside app use 1")
    if (req.method === 'OPTIONS') {
        console.log("ahgdhagdh"+ req.method)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    console.log("Inside app use 2")
    console.log("UL " + req.url);
    console.log("Method " + req.method);
    next();
});
//console.log("Before Redirection");
app.use('/searchTweet', twitterRouter);
app.use('/charts', chartRouter);
//console.log("After Redirection ");
app.use((req, res, next) => {
    console.log("Inside 404 ")
    const error = new Error('Resource not found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;