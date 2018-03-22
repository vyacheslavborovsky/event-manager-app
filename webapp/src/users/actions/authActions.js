import createAction from "redux-actions/es/createAction";

export const authActionTypes = {
    LOGIN_REQUESTING: 'LOGIN_REQUESTING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGIN_CANCEL: 'LOGIN_CANCEL',

    REGISTER_REQUESTING: 'REGISTER_REQUESTING',
    REGISTER_RESULT: 'REGISTER_RESULT',

    LOGOUT_REQUESTING: 'LOGOUT_REQUESTING',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_FAILURE: 'LOGOUT_FAILURE',

    USER_REQUEST_SUCCESS: 'USER_REQUEST_SUCCESS',
    USER_REQUEST_FAILURE: 'USER_REQUEST_FAILURE',

    RESTORE_SESSION_USER_REQUESTING: 'RESTORE_SESSION_USER_REQUESTING',

    TWITTER_INFO_SUCCESS: 'TWITTER_INFO_SUCCESS',
    TWITTER_INFO_FAILURE: 'TWITTER_INFO_FAILURE'
};

export default {
    setLoginRequesting: createAction(authActionTypes.LOGIN_REQUESTING),
    setLoginSuccess: createAction(authActionTypes.LOGIN_SUCCESS),
    setLoginFailure: createAction(authActionTypes.LOGIN_FAILURE),
    setLoginCancel: createAction(authActionTypes.LOGIN_CANCEL),

    setRegisterRequesting: createAction(authActionTypes.REGISTER_REQUESTING),
    setRegisterResult: createAction(authActionTypes.REGISTER_RESULT),

    setLogoutRequesting: createAction(authActionTypes.LOGOUT_REQUESTING),
    setLogoutSuccess: createAction(authActionTypes.LOGOUT_SUCCESS),
    setLogoutFailure: createAction(authActionTypes.LOGOUT_FAILURE),

    setUserRequestSuccess: createAction(authActionTypes.USER_REQUEST_SUCCESS),
    setUserRequestFailure: createAction(authActionTypes.USER_REQUEST_FAILURE),

    setRestoreUserRequest: createAction(authActionTypes.RESTORE_SESSION_USER_REQUESTING),

    setTwitterSuccess: createAction(authActionTypes.TWITTER_INFO_SUCCESS),
    setTwitterFail: createAction(authActionTypes.TWITTER_INFO_FAILURE)
};
