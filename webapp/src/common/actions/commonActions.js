
import createAction from "redux-actions/es/createAction";

export const commonActionTypes = {
    ADD_TOAST_MESSAGE: 'ADD_TOAST_MESSAGE',
    DISMISS_TOAST_MESSAGE: 'DISMISS_TOAST',

    NEW_TWEET: 'NEW_TWEET',
    CLEAR_TWEETS: 'CLEAR_TWEETS',
    TOGGLE_TWEETS_BOX: 'TOGGLE_TWEETS_BOX',

    INIT_WEB_SOCKET: 'INIT_WEB_SOCKET',
    CLOSE_WEB_SOCKET: 'CLOSE_WEB_SOCKET',

    NEW_NOTIFICATION: 'NEW_NOTIFICATION',

    GET_USERS_ACTIVITY_REQUESTING: 'GET_USERS_ACTIVITY_REQUESTING',
    GET_USERS_ACTIVITY_SUCCESS: 'GET_USERS_ACTIVITY_SUCCESS'
};

export default {
    setAddToastMessage: createAction(commonActionTypes.ADD_TOAST_MESSAGE),
    setDismissToastMessage: createAction(commonActionTypes.DISMISS_TOAST_MESSAGE),

    setNewTweet: createAction(commonActionTypes.NEW_TWEET),
    setClearTweets: createAction(commonActionTypes.CLEAR_TWEETS),
    setToggleTweetsBox: createAction(commonActionTypes.TOGGLE_TWEETS_BOX),

    setInitWebSocket: createAction(commonActionTypes.INIT_WEB_SOCKET),
    setCloseWebSocket: createAction(commonActionTypes.CLOSE_WEB_SOCKET),

    setGetUsersActivityRequest: createAction(commonActionTypes.GET_USERS_ACTIVITY_REQUESTING),
    setGetUsersActivitySuccess: createAction(commonActionTypes.GET_USERS_ACTIVITY_SUCCESS)
};
