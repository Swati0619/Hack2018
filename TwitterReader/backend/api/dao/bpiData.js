const { Pool, Client } = require('pg');
const path = require('path');

// DAO Layer
var logger = require('log4js').getLogger("bpiDao")
const dbSettings = require('../../config/dbSettings')
const pool = new Pool(dbSettings);
pool.on('error', (err) => {
    logger.error("Idle Client Exception", err)
});

function saveBpi(data, callback){
    var query ='INSERT INTO bpi(bpi_updatedtime, USD,GBP,EUR,id_createdtime) values ($1, $2,$3,$4,current_timestamp) RETURNING * ' 
    var values = [ data.bpi_updatedtime , data.usd , data.gbp, data.eur ];
    console.log("Bitcoin Price Index Saved Successfully");
    pool.query(query,values, function (err, result) {
        if (err) {
         logger.error("",err );
        return callback(err,null);  
        }
        else{
            return callback(null,"Bpi Saved Id :" +result.rows[0].id);
        }
    });
}

module.exports = {saveBpi}