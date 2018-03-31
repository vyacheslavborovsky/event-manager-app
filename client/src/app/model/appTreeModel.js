import authState from '../../users/constant/authStateTree';
import eventsState from '../../events/constant/eventsStateTree';
import commonDefaultState from "../../common/constants/commonState";

const appState = {
    authState: authState,
    eventsState: eventsState,
    commonState: commonDefaultState
};

export default appState
