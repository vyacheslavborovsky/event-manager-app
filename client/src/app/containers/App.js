import AppRoutes from "../../common/components/AppRoutes";
import authActions from "../../users/actions/authActions";
import Header from "../../common/containers/Header";
import React, {PureComponent} from 'react';
import {Snackbar} from "react-md";
import {connect} from "react-redux";
import {HashRouter} from 'react-router-dom';
import {navItems, toolbarItems} from "../../common/constants/navItems";
import commonActions from "../../common/actions/commonActions";

import '../../common/styles/global.css'
import '../../common/styles/material-override.css'
import 'gridlex';
import {storageServiceObj} from "../../common/services/storageService";


class App extends PureComponent {
    componentWillMount() {
        if (!this.props.authState.sessionUser && storageServiceObj.hasStorageValueByKey('token')) {
            this.props.dispatch(authActions.setRestoreUserRequest());
        }
    }

    dismissToast = () => {
        this.props.dispatch(commonActions.setDismissToastMessage());
    };

    render() {
        const routes = [...navItems, ...toolbarItems];
        const {toastMessages} = this.props.commonState;

        return (
            <HashRouter>
                <div className="grid-noGutter">
                    <Header/>
                    <AppRoutes routes={routes}/>
                    <Snackbar
                        id="app-snackbar"
                        toasts={toastMessages}
                        autohide={true}
                        onDismiss={this.dismissToast}/>
                </div>
            </HashRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authState: state.authState,
        commonState: state.commonState
    }
};

export default connect(mapStateToProps)(App);
