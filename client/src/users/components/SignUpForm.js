import React from 'react';
import {Field, reset, reduxForm} from "redux-form";
import {
    renderField, signupFormValidate, signupFormWarn
} from "../utils/user-forms.validators";
import {Button} from "react-md";
import Loader from "../../common/components/Loader";
import ringLoader from "../../assets/ring-loader.svg";

let SignUpForm = (props) => {

    return (
        <div className={(props.isAuthRequesting ? 'disabled-item' : '')}>
            <form onSubmit={props.handleSubmit(props.onSubmit)} className="grid-10-center-noGutter col-12">
                <div className="col-12-center">
                    <Field
                        id="username"
                        name="username"
                        label="Username *"
                        placeholder="Username"
                        type="text"
                        component={renderField}/>
                </div>
                <div className="col-12-center">
                    <Field
                        id="password"
                        name="password"
                        label="Password *"
                        placeholder="Password"
                        type="password"
                        component={renderField}/>
                </div>
                <div className="col-12-center">
                    <Field
                        id="email"
                        name="email"
                        label="Email address *"
                        placeholder="Email address"
                        type="text"
                        component={renderField}/>
                </div>

                {props.isRegisterSuccess !== true &&
                    <div className="col-11 grid-noGutter-spaceBetween">
                        <Button
                            raised
                            secondary
                            type="submit"
                            disabled={props.invalid || props.pristine || props.submitting}
                        >Create Account</Button>
                        <Button
                            flat
                            className="md-text--theme-info"
                            onClick={e => props.dispatch(reset('register'))}
                        >Reset</Button>
                    </div>
                }

                <div className="col-12-center grid-noGutter-spaceAround info-container">
                    {props.isRegisterSuccess !== null &&
                        <h4 className={"col-12 message" + (props.isRegisterSuccess ? " success-message" : " error-message")}>
                            {props.registerResult}
                        </h4>
                    }
                    {props.isRegisterSuccess && <Button flat primary className="col-4-center" onClick={props['goToLogin']}>Go to Account</Button>}
                    {props.isAuthRequesting && <Loader loaderSrc={ringLoader} size="250px" loadingText="Registration..."/>}
                </div>
            </form>
        </div>
    )
};


export default SignUpForm = reduxForm({
    form: 'register',
    validate: signupFormValidate,
    warn: signupFormWarn,
    destroyOnUnmount: false
})(SignUpForm);
