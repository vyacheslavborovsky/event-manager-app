const Twitter = require('twit');
const config = require('./variable');

const myTwitter = new Twitter({
    consumer_key: config.twitterProvider.consumerKey,
    consumer_secret: config.twitterProvider.consumerSecret,
    access_token: config.twitterProvider.accessTokenKey,
    access_token_secret: config.twitterProvider.accessTokenSecret,
    timeout_ms: 60 * 1000 * 2
});


exports.subscribeToTwitterStream = function (webSocketServer) {
    const twitterStream = myTwitter.stream('statuses/filter', {track: 'javascript'});

    twitterStream.on('tweet', function (tweet) {
        webSocketServer.broadcast(createTweetObject(tweet))
    });
};

const createTweetObject = function (data) {
    let tweet = {};

    tweet['id'] = data['id'];
    tweet['text'] = data['text'];
    tweet['createdDate'] = data['created_at'];
    tweet['username'] = data['user']['name'];
    tweet['screenName'] = data['user']['screen_name'];
    tweet['ACTION_TYPE'] = 'NEW_TWEET';

    return tweet;
};

exports.postTwit = function (message) {
    myTwitter.post('statuses/update', {status: message}, function (err, data, response) {
        if (err) {
            return {result: "An error occurred during posting the twit.", success: false}
        } else {
            return {success: true};
        }
    });
};


