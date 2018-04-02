const Twitter = require('twit');
const config = require('./variable');

const myTwitter = new Twitter({
    consumer_key: config.twitterProvider.consumerKey,
    consumer_secret: config.twitterProvider.consumerSecret,
    access_token: config.twitterProvider.accessTokenKey,
    access_token_secret: config.twitterProvider.accessTokenSecret,
    timeout_ms: 60 * 1000 * 2
});


function subscribeToTwitterStream(webSocketServer) {
    const twitterStream = myTwitter.stream('statuses/filter', {track: 'javascript'});

    twitterStream.on('tweet', function (tweet) {
        webSocketServer.broadcast(createTweetObject(tweet))
    });
}

function postTwit(message) {
    myTwitter.post('statuses/update', {status: message}, function (err, data, response) {
        if (err) {
            return {result: "An error occurred during posting the twit.", success: false}
        } else {
            return {success: true};
        }
    });
}

const createTweetObject = function (data) {
    return {
        id: data.id,
        text: data.text,
        createdDate: data.created_at,
        username: data.user.name,
        screenName: data.user.screen_name,
        ACTION_TYPE: NEW_TWEET
    };
};

exports.subscribeToTwitterStream = subscribeToTwitterStream;
exports.postTwit = postTwit;
