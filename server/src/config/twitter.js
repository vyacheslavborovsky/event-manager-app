/**
 * @namespace Twitter
 */

const Twitter = require('twit');
const config = require('./variable');

const myTwitter = new Twitter({
    consumer_key: config.twitterProvider.consumerKey,
    consumer_secret: config.twitterProvider.consumerSecret,
    access_token: config.twitterProvider.accessTokenKey,
    access_token_secret: config.twitterProvider.accessTokenSecret,
    timeout_ms: 60 * 1000 * 2
});

/**
 * Create twitter stream and subscribe on it to receive new twits with tag 'javascript' and send to the client via websocket
 *
 * @function subscribeToTwitterStream
 * @memberOf Twitter
 *
 * @param {object} webSocketServer
 */
function subscribeToTwitterStream(webSocketServer) {
    const twitterStream = myTwitter.stream('statuses/filter', {track: 'javascript'});
    console.log(config.twitterProvider);

    twitterStream.on('tweet', function (tweet) {
        console.log('Twit ', tweet);
        webSocketServer.broadcast(createTweetObject(tweet))
    });
}

/**
 * Post a new twit in web
 *
 * @function postTwit
 * @memberOf Twitter
 *
 * @param message
 */
function postTwit(message) {
    myTwitter.post('statuses/update', {status: message}, function (err, data, response) {
        if (err) {
            return {result: "An error occurred during posting the twit.", success: false}
        } else {
            return {success: true};
        }
    });
}

/**
 * Create object to send via websocket to the client
 *
 * @function createTweetObject
 * @memberOf Twitter
 *
 * @param {object} data - twitter API response object
 * @return {{id, text, createdDate: object, username: string, screenName: string, ACTION_TYPE: string}}
 */
function createTweetObject(data) {
    return {
        id: data.id,
        text: data.text,
        createdDate: data.created_at,
        username: data.user.name,
        screenName: data.user.screen_name,
        ACTION_TYPE: 'NEW_TWEET'
    };
}

exports.subscribeToTwitterStream = subscribeToTwitterStream;
exports.postTwit = postTwit;
