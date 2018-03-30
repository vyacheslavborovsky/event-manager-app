import appState from "../../app/model/appTreeModel";
import handleActions from "redux-actions/es/handleActions";
import {authActionTypes} from '../actions/authActions'
import combineActions from "redux-actions/es/combineActions";

const defaultState = {
    ...appState.authState
};

const authReducer = handleActions({
    [combineActions(
        authActionTypes.LOGIN_REQUESTING,
        authActionTypes.REGISTER_REQUESTING,
        authActionTypes.LOGOUT_REQUESTING,
        authActionTypes.RESTORE_SESSION_USER_REQUESTING
    )]: (state, action) => ({
            ...state,
            isAuthRequesting: true
        }
    ),

    [authActionTypes.LOGIN_SUCCESS]: (state, action) => ({
        ...state,
        token: action['payload']['token'],
        isLoginSuccess: action['payload']['isLoginSuccess'],
    }),

    [combineActions(
        authActionTypes.LOGIN_FAILURE,
        authActionTypes.LOGIN_CANCEL
    )]: (state, action) => ({
        ...state,
        isLoginSuccess: action['payload']['isLoginSuccess'],
        loginResult: action['payload']['reason'],
        isAuthRequesting: false
    }),

    [authActionTypes.REGISTER_RESULT]: (state, action) => ({
        ...state,
        isRegisterSuccess: action['payload']['isRegisterSuccess'],
        registerResult: action['payload']['reason'],
        isAuthRequesting: false
    }),

    [authActionTypes.LOGOUT_SUCCESS]: (state, action) => ({
        ...defaultState
        /*...state,
        sessionUser: null,
        isLoginSuccess: null,
        loginResult: null,
        token: null,
        isAuthRequesting: false*/
    }),

    [combineActions(
        authActionTypes.LOGOUT_FAILURE,
        authActionTypes.USER_REQUEST_FAILURE
    )]: (state, action) => ({
        ...state,
        isAuthRequesting: false
    }),

    [authActionTypes.TWITTER_INFO_SUCCESS]: (state, action) => ({
        ...state,
        sessionUser: {
            ...state.sessionUser,
            twitter: action['payload']['twitter']
        },
        isTwitterAuth: true
    }),

    [authActionTypes.TWITTER_INFO_FAILURE]: (state, action) => ({
        ...state,
        isTwitterAuth: false
    }),

    [authActionTypes.USER_REQUEST_SUCCESS]: (state, action) => ({
        ...state,
        sessionUser: action['payload']['user'],
        isLoginSuccess: true,
        isAuthRequesting: false
    }),

    [authActionTypes.RESET_AUTH_FLAGS]: (state, action) => ({
        ...state,
        isRegisterSuccess: null,
        registerResult: null
    })

}, defaultState);

export default authReducer;
