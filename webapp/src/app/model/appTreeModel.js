import authState from '../../users/shared/authStateTree';
import eventsState from '../../events/shared/eventsStateTree';
import commonDefaultState from "../../common/constants/commonState";

const appState = {
    authState: authState,
    eventsState: eventsState,
    commonState: commonDefaultState
};

export default appState
