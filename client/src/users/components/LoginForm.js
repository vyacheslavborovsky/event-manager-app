import React from 'react';
import {Field, reset, reduxForm} from "redux-form";
import {
    loginFormValidate,
    renderField
} from "../shared/user-forms.validators";

import ringLoader from '../../assets/ring-loader.svg';

import {Button} from "react-md";
import Loader from "../../common/components/Loader";

let LoginForm = (props) => {
    return (
        <div className={(props.isAuthRequesting ? 'disabled-item' : '')}>
            <form onSubmit={props.handleSubmit(props.onSubmit)} className="grid-10-center-noGutter col-12">
                <div className="col-12-center">
                    <Field
                        id="username"
                        name="username"
                        label="Username *"
                        placeholder="username"
                        type="text"
                        component={renderField}/>
                </div>
                <div className="col-12-center">
                    <Field
                        id="password"
                        name="password"
                        label="Password *"
                        placeholder="password"
                        type="password"
                        component={renderField}/>
                </div>
                <div className="col-12-center grid-noGutter-spaceAround">
                    <Button
                        raised
                        primary
                        type="submit"
                        className="col-2"
                        disabled={props.invalid || props.pristine || props.submitting}
                    >Log In</Button>

                    <Button
                        flat
                        className="md-text--theme-warning"
                        onClick={e => props.dispatch(reset('login'))}
                    >Reset</Button>
                </div>
            </form>
            <div className="grid-center col-12 info-container">
                <h4 className="message error-message">
                    {props.loginResult}
                </h4>
                {props.isAuthRequesting && <Loader loaderSrc={ringLoader} size="250px" colNumber="6" loadingText="Authorization..."/>}
            </div>
        </div>
    )
};


export default LoginForm = reduxForm({
    form: 'login',
    validate: loginFormValidate,
    destroyOnUnmount: false
})(LoginForm);
