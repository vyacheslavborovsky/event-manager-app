import authActions from "../actions/authActions";
import LoginForm from "../components/LoginForm";
import React, {PureComponent} from 'react';
import {Card, CardText, CardTitle} from "react-md";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import appConfig from "../../common/constants/config";


class Login extends PureComponent {
    login = (user) => {
        this.props.dispatch(authActions.setLoginRequesting({
            username: user.username,
            password: user.password
        }));
    };

    render() {
        const {isLoginSuccess, isAuthRequesting, loginResult} = this.props.authState;
        const {from} = this.props.location.state || {from: {pathname: '/events-calendar'}};

        if (isLoginSuccess) {
            return (
                <Redirect to={from}/>
            )
        }

        return (
            <Card className="grid-noGutter-center-middle auth-container md-paper--5">
                <CardTitle
                    title="Account Log In"
                    subtitle="Please, fill out fields below:"
                    className="grid-6-center col-12"
                />
                <CardText className="grid-noGutter-center-middle">
                    <LoginForm
                        onSubmit={user => this.login(user)}
                        isLoginSuccess={isLoginSuccess}
                        loginResult={loginResult}
                        isAuthRequesting={isAuthRequesting} />
                </CardText>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authState: state.authState
    }
};

export default connect(mapStateToProps)(Login)
