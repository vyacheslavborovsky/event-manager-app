import applyMiddleware from "redux/es/applyMiddleware";
import appReducer from "../reducers/appReducer";
import createSagaMiddleware from 'redux-saga'
import createStore from "redux/es/createStore";
import appSaga from '../middleware/index';
import {enableBatching} from 'redux-batched-actions';

export default function configureStore() {
    const sagaMiddleware = createSagaMiddleware();

    return {
        ...createStore(
            enableBatching(appReducer),
            applyMiddleware(sagaMiddleware)),
        runSaga: sagaMiddleware.run(appSaga)
    }

}
