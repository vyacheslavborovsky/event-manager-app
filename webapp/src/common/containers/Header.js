import * as _ from 'lodash';
import authActions from "../../users/actions/authActions";
import NavItemLink from "../components/NavItemLink";
import React, {PureComponent} from 'react';
import ToolbarMenu from "./ToobarMenu";
import UserProfile from "../../users/components/UserProfile";
import {Button, Drawer, Toolbar} from "react-md";
import {connect} from "react-redux";
import {navItems, toolbarItems} from '../constants/navItems';
import {withRouter} from "react-router-dom";
import commonActions from "../actions/commonActions";

class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isDrawerVisible: false,
        };

    }

    onTwitterSuccess = (response) => {
        response.json()
            .then(twitterInfo => {
                this.props.dispatch(authActions.setTwitterSuccess(twitterInfo));
            })
    };

    onTwitterFailed = (error) => {
        this.props.dispatch(authActions.setTwitterFail())
    };

    logout = () => {
        this.props.dispatch(authActions.setLogoutRequesting());
    };


    showSubNav = () => {
        this.setState({
            isDrawerVisible: true
        })
    };

    handleDrawerVisibility = (isDrawerVisible) => {
        this.setState({isDrawerVisible});
    };


    getCorrectToolbarActions = () => {
        return _.filter(toolbarItems, item => item['isShow'](this.props.authState));
    };


    onClickItem = (item) => {
        if (item.action) {
            this[item.action]();
        }
    };

    toggleTweetsBox = (show) => {
        this.props.dispatch(commonActions.setToggleTweetsBox(show));
    };

    render() {
        const {isDrawerVisible} = this.state;
        const {pathname} = this.props.history.location;
        const {sessionUser, isTwitterAuth} = this.props.authState;
        const {showTweetsBox} = this.props.commonState;
        const toolbarActions = this.getCorrectToolbarActions();

        return (
            [
                <Toolbar key="appToolbar"
                         colored
                         fixed
                         title="Event Manager"
                         className="md-paper--4"
                         nav={<Button icon disabled={!sessionUser} onClick={this.showSubNav}>
                             menu
                         </Button>}
                                actions={<ToolbarMenu
                                toolbarActions={toolbarActions}
                                id="appToolbar"
                                onClickItem={this.onClickItem}/>}
                />,
                <Drawer key="appSubnav"
                        type={Drawer.DrawerTypes.TEMPORARY}
                        visible={isDrawerVisible}
                        onVisibilityChange={this.handleDrawerVisibility}
                        header={<UserProfile sessionUser={sessionUser}
                                             isTwitterAuth={isTwitterAuth}
                                             toggleTweetsBox={this.toggleTweetsBox}
                                             showTweetsBox={showTweetsBox}
                                             onTwitterSuccess={this.onTwitterSuccess}
                                             onTwitterFailed={this.onTwitterFailed}/>}
                        className="navigation"
                        navItems={navItems.map(props => <NavItemLink {...props} pathname={pathname} key={props.to}/>)}/>
            ]
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authState: state.authState,
        commonState: state.commonState
    }
};

export default connect(mapStateToProps)(withRouter(Header));

