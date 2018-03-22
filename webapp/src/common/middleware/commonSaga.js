import {call, take, put, fork} from "redux-saga/effects";
import commonActions, {commonActionTypes} from "../actions/commonActions";
import {helperServiceObj} from "../services/helperService";
import {batchActions} from 'redux-batched-actions';


function* getUsersActivity() {
    try {
        const result = yield call(helperServiceObj.getUsersActivityData);
        yield put(batchActions([
            commonActions.setGetUsersActivitySuccess({success: true, data: result['data']}),
            commonActions.setAddToastMessage({text: "Users activities have been loaded to the dashboard"})
        ]));
    } catch (err) {
        yield put(batchActions([
            commonActions.setGetUsersActivitySuccess({success: false}),
            commonActions.setAddToastMessage({text: "An Error occurred during loading events"})
        ]));
    }
}

function* activityFlow() {
    while (true) {
        yield take(commonActionTypes.GET_USERS_ACTIVITY_REQUESTING);
        yield call(getUsersActivity);
    }
}

function* commonWatcher() {
    yield fork(activityFlow)
}

export default commonWatcher;
