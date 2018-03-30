import React from 'react';

let Tweet = ({tweetInfo}) => {
    return (
        <h4 className="tweet col-12"><a href={`https://twitter.com/${tweetInfo['screenName']}`} target="_blank">{tweetInfo['username']}</a> tweeted: <span className="tweet-message">{tweetInfo.text}</span></h4>
    )
};

export default Tweet;
