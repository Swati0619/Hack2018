const request = require('request');
const bpiData = require('../dao/bpiData')

function getCurrentBpi(callback){
    request.get("https://api.coindesk.com/v1/bpi/currentprice.json",function(err,data){
        if(err)
        {
            return callback(err,null);
        }
        var jsonResponse = JSON.parse(data.body);
        var dataToInsert = {
            bpi_updatedtime:jsonResponse.time.updated,
            usd:jsonResponse.bpi.USD.rate_float,
            gbp:jsonResponse.bpi.GBP.rate_float,
            eur:jsonResponse.bpi.EUR.rate_float
        }
        bpiData.saveBpi(dataToInsert, function(err,data){
            if(err){
                return callback(err,null);
            }
            else{
                return callback(null,data)
            }
        })
    })
}

module.exports = {getCurrentBpi};