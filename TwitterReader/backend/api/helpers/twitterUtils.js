var twitter = require('twitter-text');

function neutraizeTweet(tweet) {
    var text = tweet;
    var names = twitter.extractMentions(tweet);
    var urls = twitter.extractUrls(tweet)
    var hashtags = twitter.extractHashtags(tweet);
    var cashTags = twitter.extractCashtags(tweet);
    var replacingArr = new Array();
    names.forEach(element => {
        replacingArr.push(element);    
    });
    urls.forEach(element => {
        replacingArr.push(element);
    });
    hashtags.forEach(element => {
        replacingArr.push(element);
    });
    cashTags.forEach(element => {
        replacingArr.push(element);
    });
    for (counter = 0; counter < replacingArr.length; counter++) {
        text = text.replace(replacingArr[counter], "");
    }
    return{
        text:text,
        cashTags:cashTags,
        hashtags:hashtags
    } 
}

// Put exports at last 
module.exports.getNeutralisedTweet = neutraizeTweet;