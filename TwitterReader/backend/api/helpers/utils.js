var sentiment = require('sentiment');
var words = require('../../config/words')
const twitterUtils = require('./twitterUtils')

exports.SuccessfulPostResponse = function (request, response, msg) {
    response.writeHead(200, { 'Content-type': 'application/json' });
    if (msg) {
        response.end(JSON.stringify(msg));
    }
    else {
        response.end();
    }
}


exports.SuccessfulPostData = function (request, response, data) {
    response.writeHead(200, { 'Content-type': 'application/json' });
    if (data) {
        response.end(JSON.stringify(data));
    }
    else {
        response.end();
    }
}

exports.Error500 = function (request, response, err) {
    response.writeHead(500, 'Internal server error!', { 'Content-type': 'application/json' });
    response.write(JSON.stringify({ error: `Internal server error: ${err}` }));
    response.end();
}

exports.Error400 = function (request, response, err) {
    response.writeHead(404, 'Bad request!', { 'Content-type': 'application/json' });
    response.write(JSON.stringify({ error: `Bad request: ${err}` }));
    response.end();
}

exports.getActualData = function (tweets, searchStr) {
    if (!tweets) {
        return null;
    }

    var tweetsData = new Array();
    if (tweets.length > 0) {
     //   console.log("Status Found ");
        for (var i = 0; i < tweets.length; i++) {
            var senti = null;
            var text_to_save = null;
            if (tweets[i].retweeted_status) {
                senti = sentimentCheck(tweets[i].retweeted_status.full_text)
                text_to_save = tweets[i].retweeted_status.full_text;
            }
            else {
                senti = sentimentCheck(tweets[i].full_text)
                text_to_save = tweets[i].full_text
            }

            var tweet = {
                tweet: text_to_save,
                user: tweets[i].user.screen_name,
                createdDate: new Date(tweets[i].created_at),
                tweet_id: tweets[i].id_str,
                search_str: searchStr,
                sentiment_value: senti.score,
                sentiment_category: senti.category,
                uncategorised: senti.words,
                followers_count: tweets[i].user.followers_count,
                listed_count: tweets[i].user.listed_count,
                user_likes: tweets[i].user.favourites_count,
                verified_user: tweets[i].user.verified,
                retweet_count: tweets[i].retweet_count,
                tweet_likes: tweets[i].favorite_count,
                retweeted: tweets[i].retweeted,
                cashTags:senti.cashTags,
                hashTags:senti.hashTags
            }
            tweetsData.push(tweet);
        }
    }
    return tweetsData;
}


function sentimentCheck(str) {
    var cleanData  = twitterUtils.getNeutralisedTweet(str);
    nuetrastr = cleanData.text;
    var cashTags = cleanData.cashTags.toString();
    var hashTags = cleanData.hashtags.toString();
    var preProcess = nuetrastr.toLowerCase();
    preProcess = preProcess.replace(/[^a-zA-Z ]/g, "");

    var result = sentiment(preProcess, words.sentiments);

    if (result.score > 0) {
        category = 1 // Positive 
    } else if (result.score < 0) {
        category = 2 // Negative
    }
    else {
        category = 0; // Neutral
    }
    var notConsidered = result.tokens.filter(function (item) {
        return result.words.indexOf(item) === -1;
    });

    return {
        "score": result.score,
        "category": category,
        "words": notConsidered.toString(),
        "cashTags":cashTags,
        "hashTags":hashTags
    };
}

function extractSentiments(tweets) {
    var updateArr = new Array();
    if (tweets && tweets.length > 0) {
        for (var count = 0; count < tweets.length; count++) {

            var senti = sentimentCheck(tweets[count].tweet);
            var singleData = {
                "tweet_id": tweets[count].tweet_id,
                "sentiment_value": senti.score,
                "sentiment_category": senti.category,
                "words": senti.words
            }
            updateArr.push(singleData);
        }
    }
    return updateArr;
}

var flatten = function (a, shallow, r) {
    if (!r) { r = []; }
    if (shallow) {
        return r.concat.apply(r, a);
    }
    for (i = 0; i < a.length; i++) {
        if (a[i].constructor == Array) {
            flatten(a[i], shallow, r);
        } else {
            r.push(a[i]);
        }
    }
    return r;
};

function uniqueTweets(tweets, data) {
    var unique = new Array();
    for (i = 0; i < tweets.length; i++) {
        var found = false;
        for (j = 0; j < data.length; j++) {
            if (data[j].tweet_id === tweets[i].id_str) {
                found = true;
                break;
            }
        }
        if (!found) {
            unique.push(tweets[i]);
        }
    }
    return unique;
}

module.exports.getSentimentScore = sentimentCheck;
module.exports.extractSentiments = extractSentiments;
module.exports.getUniqueTweets = uniqueTweets;