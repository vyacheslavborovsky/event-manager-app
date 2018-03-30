import commonDefaultState from "../constants/commonState";
import handleActions from "redux-actions/es/handleActions";
import {commonActionTypes} from "../actions/commonActions";


const defaultState = {
    ...commonDefaultState
};

const commonReducer = handleActions({
    [commonActionTypes.ADD_TOAST_MESSAGE]: (state, action) => {
        const toasts = state.toastMessages.slice();
        toasts.push(action.payload);

        return {
            ...state,
            toastMessages: toasts
        }
    },

    [commonActionTypes.DISMISS_TOAST_MESSAGE]: (state) => {
        const [, ...toasts] = state.toastMessages;
        return {
            ...state,
            toastMessages: toasts
        }
    },

    [commonActionTypes.NEW_TWEET]: (state, action) => ({
        ...state,
        tweets: [action.payload, ...state.tweets]
    }),

    [commonActionTypes.CLEAR_TWEETS]: (state, action) => ({
        ...state,
        tweets: []
    }),

    [commonActionTypes.TOGGLE_TWEETS_BOX]: (state, action) => ({
        ...state,
        showTweetsBox: action.payload
    }),

    [commonActionTypes.GET_USERS_ACTIVITY_REQUESTING]: (state, action) => ({
        ...state,
        commonRequestPending: true
    }),

    [commonActionTypes.GET_USERS_ACTIVITY_SUCCESS]: (state, action) => {
        let data = null;

        if (action.payload['success']) {
            data = action.payload['data'].filter(item => item.username && item.username[0]).map(item => {
                return {
                    ...item,
                    username: item.username[0]
                }
            });
        }
        return {
            ...state,
            commonRequestPending: false,
            usersActivity: data
        }
    }
}, defaultState);

export default commonReducer;
