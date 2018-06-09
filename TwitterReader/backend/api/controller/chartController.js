const chartDao = require('../dao/chartDao');
const utils = require('../helpers/utils');

function getBPIChartData(req, res, next) {

    var rqSearch = {
        timeFilter: req.body.timeFilter,
    }
    if (!rqSearch.timeFilter) {
        rqSearch.timeFilter = '60 minutes'
    }
    chartDao.getBPIChartData(rqSearch, function (err, data) {
        if (err) {
            utils.Error500(req, res, err);
        }
        else {
            utils.SuccessfulPostResponse(req, res, data);
        }
    })
}

function getSentiChartData(req, res, next) {

    var rqSearch = {
        timeFilter: req.body.timeFilter,
    }
    if (!rqSearch.timeFilter) {
        rqSearch.timeFilter = '60 minutes'
    }
    chartDao.getSentimentChartData(rqSearch, function (err, data) {
        if (err) {
            utils.Error500(req, res, err);
        }
        else {
            utils.SuccessfulPostResponse(req, res, data);
        }
    })
}

function getDescisonChartData(req, res, next) {

    var rqSearch = {
        timeFilter: req.body.timeFilter,
    }
    if (!rqSearch.timeFilter) {
        rqSearch.timeFilter = '60 minutes'
    }
    chartDao.getBuySellChartData(rqSearch, function (err, data) {
        if (err) {
            utils.Error500(req, res, err);
        }
        else {
            utils.SuccessfulPostResponse(req, res, data);
        }
    })
}
module.exports = {
    getBPIChartData, getSentiChartData , getDescisonChartData
}