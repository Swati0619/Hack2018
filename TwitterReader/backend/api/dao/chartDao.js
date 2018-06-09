const { Pool, Client } = require('pg');
const path = require('path');

// DAO Layer
var logger = require('log4js').getLogger("bpiDao")
const dbSettings = require('../../config/dbSettings')
const pool = new Pool(dbSettings);
pool.on('error', (err) => {
    logger.error("Idle Client Exception", err)
});


function getBPIChartData(data, callback) {
    var query = "select date_trunc('minute', id_createdtime) as bpiCapture,  USD from bpi where id_createdtime > current_timestamp - interval '" + data.timeFilter + "'"
    pool.query(query, function (err, result) {
        if (err) {
            logger.error("", err);
            return callback(err, null);
        }
        else {
            return callback(null, result.rows);
        }
    });
}

function getSentimentChartData(data, callback) {
    var query = "select date_trunc('minute', tweeted_time) as timeC,  ROUND(AVG(sentiment_value),1) from tweets where tweeted_time > current_timestamp - interval '" + data.timeFilter + "' group by timeC"
    pool.query(query, function (err, result) {
        if (err) {
            logger.error("", err);
            return callback(err, null);
        }
        else {
            return callback(null, result.rows);
        }
    });
}

function calculatingAction(data, callback) {

    query = "Select( (select  USD as maxUSd from bpi where id_createdtime > current_timestamp - interval '" + data.timeFilter + "'   order by id_createdtime desc limit 1)-" +
        " (select   USD as MinUSD from bpi where id_createdtime > current_timestamp - interval '" + data.timeFilter + "'  order by id_createdtime asc limit 1)" +
        ")PriceDiff," +
        "(Select avg(sentiment_value) from tweets  where tweeted_time > current_timestamp - interval '" + data.timeFilter + "')"

    pool.query(query, function (err, result) {
        if (err) {
            logger.error("", err);
            return callback(err, null);
        }
        else {
            var rows = result.rows;
            var PriceDiff = rows[0].pricediff
            var sentiment = rows[0].avg
            var result = "NO ACTION"
            if (PriceDiff && sentiment) {
                if (PriceDiff > 0 && sentiment > 0) {
                    result = "BUY"
                }
                else if (PriceDiff < 0 && sentiment < 0) {
                    result = "SELL"
                }
                var insertQuery = "insert into buysell (pricedelta,avgsentiment,action) values ($1,$2,$3) Returning *"
                var values = [PriceDiff, sentiment, result]
                pool.query(insertQuery, values, function (err, data) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        callback(null, "BuySell Id :"+data.rows[0].id);
                    }
                });
            }
            else {
                callback(null, "No Change ");
            }
        }
    });
}
module.exports = { getBPIChartData, getSentimentChartData, calculatingAction }