import {all, fork} from 'redux-saga/effects';
import AuthWatcher from "../../users/middleware/authSaga";
import EventsWatcher from '../../events/middleware/eventsSaga';
import webSocketWatcher from '../../common/middleware/webSocketSaga';
import commonWatcher from '../../common/middleware/commonSaga';

export default function* appSaga() {
    yield all([
        fork(AuthWatcher),
        fork(EventsWatcher),
        fork(webSocketWatcher),
        fork(commonWatcher)
    ])
}
