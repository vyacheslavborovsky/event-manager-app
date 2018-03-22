import appConfig from "../../common/constants/config";
import authActions from "../actions/authActions";
import commonActions from "../../common/actions/commonActions";
import {authActionTypes} from "../actions/authActions";
import {authServiceObj} from "../services/authService";
import {call, cancelled, take, put, fork} from "redux-saga/effects";
import {storageServiceObj} from "../../common/services/storageService";


function* authorize(username, password) {
    try {
        const result = yield call(authServiceObj.login, {
            username,
            password
        });

        if (result['success'] && result['x-auth-token']) {
            yield call(storageServiceObj.saveDataByName, 'token', result['x-auth-token']);


            try {
                const currentUser = yield call(authServiceObj.getCurrentUser);
                yield put(authActions.setUserRequestSuccess({user: currentUser}));
                yield put(commonActions.setInitWebSocket(appConfig.webSocketConnection));
            } catch (error) {
                yield put(authActions.setUserRequestFailure());
            }

            yield put(authActions.setLoginSuccess({token: result['x-auth-token'], isLoginSuccess: true}));
        } else {
            yield put(authActions.setLoginFailure({isLoginSuccess: false, reason: result['message']}));
        }
    } catch (error) {
        yield put(authActions.setLoginFailure({isLoginSuccess: false, reason: error}));
    } finally {
        if (yield cancelled()) {
            yield put(authActions.setLoginCancel({isLoginSuccess: false, reason: 'Login request has been canceled.'}));
        }
    }
}

function* register(username, password, email) {
    try {
        const result = yield call(authServiceObj.register, {
            username,
            password,
            email
        });

        yield put(authActions.setRegisterResult({isRegisterSuccess: result['success'], reason: result['message']}))
    } catch (error) {
        yield put(authActions.setRegisterResult({isRegisterSuccess: false, reason: 'Error during register. Try again'}))
    }
}

function* logout() {
    try {
        const removed = storageServiceObj.removeItem('token');

        if (removed) {
            yield put(authActions.setLogoutSuccess());
            yield put(commonActions.setCloseWebSocket());
        }
    } catch (error) {
        yield put(authActions.setLogoutFailure());
    }
}

function* initSessionUser() {
    if (storageServiceObj.hasStorageValueByKey('token')) {
        try {
            const currentUser = yield call(authServiceObj.getCurrentUser);
            yield put(authActions.setUserRequestSuccess({user: currentUser}));
            yield put(commonActions.setInitWebSocket(appConfig.webSocketConnection));
        } catch (error) {
            yield put(authActions.setUserRequestFailure());
        }
    }
}


function* loginFlow() {
    while (true) {
        const action = yield take(authActionTypes.LOGIN_REQUESTING);
        const {username, password} = action['payload'];
        yield fork(authorize, username, password);
    }
}

function* logoutFlow() {
    while (true) {
        yield take(authActionTypes.LOGOUT_REQUESTING);
        yield fork(logout)
    }
}

function* registerFlow() {
    while (true) {
        const action = yield take(authActionTypes.REGISTER_REQUESTING);
        const {username, password, email} = action.payload;

        yield fork(register, username, password, email)
    }
}

function* twitterFlow() {
    while (true) {
        const action = yield take(authActionTypes.TWITTER_INFO_SUCCESS);

        const {twitterData} = action['payload'];
        yield put(authActions.setTwitterSuccess({twitter: twitterData}));

        yield take(authActionTypes.TWITTER_INFO_FAILURE);
        yield put(authActions.setTwitterFail());
    }
}

function* restoreUserFlow() {
    yield take(authActionTypes.RESTORE_SESSION_USER_REQUESTING);
    yield fork(initSessionUser);
}


// MAIN AUTH WATCHER
function* AuthWatcher() {
    yield fork(restoreUserFlow);
    yield fork(loginFlow);
    yield fork(logoutFlow);
    yield fork(registerFlow);
    yield fork(twitterFlow);
}

export default AuthWatcher;
