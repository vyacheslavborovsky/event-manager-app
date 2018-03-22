import React from 'react';
import {Avatar, IconSeparator, SelectionControl} from "react-md";
import TwitterLogin from 'react-twitter-auth';
import appConfig from "../../common/constants/config";

import '../styles/user.css'

const UserProfile = ({sessionUser, onTwitterFailed, onTwitterSuccess, toggleTweetsBox, showTweetsBox}) => {
    if (sessionUser) return (
        <div className="grid-center-noGutter-column user-profile">
            <IconSeparator
                label=""
                iconBefore
                className="col profileIcon">
                <Avatar random>{sessionUser.local.username.substring(0, 1).toUpperCase()}</Avatar>
            </IconSeparator>
            <span className="grid-4-center username">{sessionUser.local.username}</span>
            <span className="grid-8-center email">{sessionUser.local.email}</span>

            {sessionUser['twitter'] &&
                <div className="grid-noGutter-middle-center twitter-section">
                    <a className="col-12 twitter-header" href={`https://twitter.com/intent/user?user_id=${sessionUser['twitter']['id']}`} target="_blank">Twitter account:</a>
                    <span className="grid-4-center">{sessionUser['twitter'].username}</span>
                    <span className="grid-8-center email">{sessionUser['twitter'].email}</span>
                    <Avatar src={sessionUser['twitter']['avatarUrl']} role="presentation" />

                </div>
            }

            {!sessionUser['twitter'] &&
                <TwitterLogin
                    text="Add twitter"
                    className="md-btn md-text--theme-primary"
                    loginUrl={`${appConfig.mode === 'production' ? '/api/v1' : ''}/auth/twitter?userId=${sessionUser._id}`}
                    onFailure={onTwitterFailed} onSuccess={onTwitterSuccess}
                    requestTokenUrl={`${appConfig.mode === 'production' ? '/api/v1' : ''}/auth/twitter/reverse`}/>
            }

            <div className="grid-noGutter col-12-center">
                <SelectionControl
                    id="show-tweets"
                    type="switch"
                    label="Toggle Tweets Box"
                    name="tweets-ctrl"
                    onChange={toggleTweetsBox}
                    checked={showTweetsBox}
                />
            </div>
        </div>
    );

    return (
        <div className="grid-noGutter-center-middle">
            <div className="col">
                <h3>No user data provided.</h3>
            </div>
        </div>
    )
};


export default UserProfile;
