import authActions from "../actions/authActions";
import React, {PureComponent} from 'react';
import SignUpForm from '../components/SignUpForm'
import {Card, CardText, CardTitle} from "react-md";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";


class Register extends PureComponent {
    register = (user) => {

        this.props.dispatch(authActions.setRegisterRequesting({
            username: user.username,
            password: user.password,
            email: user.email
        }));
    };

    componentDidMount() {

    }

    redirectToLoginPage = () => {
        this.props.history.push('/login');
    };

    render() {
        const {isRegisterSuccess, isAuthRequesting, registerResult, } = this.props.authState;

        return (
            <Card className="grid-noGutter-center-middle auth-container md-paper--5">
                <CardTitle
                    title="Registration form"
                    subtitle="Please, fill out fields below:"
                    className="grid-6-center col-12"
                />
                <CardText className="grid-noGutter-center-middle">
                    <SignUpForm
                        onSubmit={user => this.register(user)}
                        goToLogin={this.redirectToLoginPage}
                        isRegisterSuccess={isRegisterSuccess}
                        registerResult={registerResult}
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

export default connect(mapStateToProps)(withRouter(Register))
