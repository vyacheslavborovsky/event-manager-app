import React from "react";
import {connect} from "react-redux";
import {Redirect, Route} from "react-router-dom";


const PrivateRoute = ({component: Component, ...rest}) => {
    const {isLoginSuccess} = rest;
    return (
        <Route {...rest} render={props => {
            return (
                isLoginSuccess ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: {from: props.location}
                    }}/>
                )
            )
        }}/>
    )};

const mapStateToProps = (state) => {
    return {
        isLoginSuccess: state.authState.isLoginSuccess,
    }
};

export default connect(mapStateToProps)(PrivateRoute);
