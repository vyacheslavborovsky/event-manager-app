import authReducer from "../../users/reducers/authReducer";
import combineReducers from "redux/es/combineReducers";
import eventsReducer from "../../events/reducers/eventsReducer";
import {reducer as FormReducer} from 'redux-form';
import commonReducer from "../../common/reducers/commonReducer";


const appReducer = combineReducers({
    authState: authReducer,
    eventsState: eventsReducer,
    commonState: commonReducer,
    form : FormReducer
});

export default appReducer;
