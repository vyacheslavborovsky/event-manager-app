import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Scrollbars } from 'react-custom-scrollbars';
import Tweet from "../components/Tweet";
import {Button} from "react-md/lib/Buttons/index";


let TweetsBox = ({tweets, clearTweetsBox}) => {
    let renderTweetsBox = tweets.map(tweet => {
        return (
            <Tweet key={tweet.id} tweetInfo={tweet} />
        )
    });

    return (
        <div className="tweet-box grid-center">
            <h3 className="col-11-center header">Here will be displaying all new tweets with tag <span className="key-word">javascript</span></h3>
            {tweets && tweets.length > 5 && <Button raised
                                                     primary
                                                     className="col-5-center clear-btn"
                                                     onClick={clearTweetsBox}>Clear Box</Button>
            }
            <Scrollbars
                autoHide
                autoHideTimeout={500}
                autoHideDuration={100}
                thumbMinSize={30}
                style={{ height: 500 }}>
                <ReactCSSTransitionGroup transitionName="tweet"
                                         transitionEnterTimeout={300}
                                         transitionLeave={false}>
                    {tweets && tweets.length > 0 && renderTweetsBox}
                </ReactCSSTransitionGroup>
            </Scrollbars>

        </div>
    )
};

export default TweetsBox;
