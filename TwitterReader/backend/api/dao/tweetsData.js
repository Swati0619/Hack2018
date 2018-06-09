const { Pool, Client } = require('pg');
const path = require('path');

// DAO Layer
var logger = require('log4js').getLogger("twitterDao")
const dbSettings = require('../../config/dbSettings')
const pool = new Pool(dbSettings);
pool.on('error', (err) => {
    logger.error("Idle Client Exception", err)
});
module.exports.saveTweets = function (tweets) {

    if (tweets.length > 0) {
        for (var i = 0; i < tweets.length; i++) {
            try {
                // Check if Tweet Exits earlier or not 
                pool.query('INSERT INTO tweets(tweet_id, tweet,tweeted_time,search_str,user_name,sentiment_value,senti_category, followers_count, listed_count, user_likes, verified_user, retweet_count, tweet_likes, retweeted,unclassified , cashtag , hashtag) values($1, $2,$3,$4,$5,$6,$7, $8, $9, $10, $11,$12, $13, $14, $15, $16, $17) ',
                    [tweets[i].tweet_id, tweets[i].tweet, tweets[i].createdDate, tweets[i].search_str, tweets[i].user, tweets[i].sentiment_value, tweets[i].sentiment_category,tweets[i].followers_count, tweets[i].listed_count,tweets[i].user_likes,tweets[i].verified_user, tweets[i].retweet_count,tweets[i].tweet_likes,tweets[i].retweeted , tweets[i].uncategorised, tweets[i].cashTags, tweets[i].hashTags ], function (err, result) {
                        // done(); // closing the connection;
                        if (err) {
                         logger.error("",err );
                        }
                    });
            }
            catch (err) {
                logger.error("Error Occured while Saving Data")
            }
        }
        return true;
    }
    return false;
}

module.exports.getDataForTweet = function (searchStr, callback) {
    var queryToExec = "Select * from tweets where search_str = '" + searchStr + "'"

    const query = pool.query(queryToExec, function (err, result) {
        if (err) {
            console.log(err);
        }
        return callback(result.rows);
    });
    // Stream results back one row at a time
}


