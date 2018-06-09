
var log4js = require('log4js');
const utils = require('../helpers/utils');
const request = require('request')
var Twitter = require('../twitter/twitter');
var logger = log4js.getLogger('twitter')
var sentiment = require('sentiment')
var twitterDao = require('../dao/tweetsData')
const twiiterConfig = require('../../config/twitterConfig');
var client = new Twitter(twiiterConfig);

function searchTwitterFortag (req, res, next) {

    const rqSearch = {
        searchParam: req.body.searchTerm,
    }
    var encodedSearchTerm = encodeURIComponent(rqSearch.searchParam);
    searchWithTwitter(req,res,encodedSearchTerm);
}

function searchWithTwitter( req,res,searchTerm) {
   pullDataFromTwitter(searchTerm, function(err,data){
       if(err){
          return  utils.Error500(req,res,err);
       }
      return utils.SuccessfulPostResponse(req,res,data)
   })
}

 function pullDataFromTwitter(searchTerm, callback){
    
    client.get('search/tweets', { q: searchTerm,src:'ctags',truncated:false, count: 100,language:'en_us', tweet_mode:'extended' }, function (error, tweets, response) {
        if(error){
           return  callback(error);
        }
        if (tweets.statuses.length > 0) {
            // Get Data from Database and Match score 
            twitterDao.getDataForTweet(searchTerm, function (data) {
                var filteredTweets = utils.getUniqueTweets(tweets.statuses,data);
                var TwitterSavingData = utils.getActualData(filteredTweets, searchTerm);
                twitterDao.saveTweets(TwitterSavingData)
                callback(null,searchTerm + " Tweets Saved Successfully")
            });
        }
        else {
            callback(null, searchTerm + " No Tweets Found  ")
        }
    });
}

module.exports = {pullDataFromTwitter,searchTwitterFortag}