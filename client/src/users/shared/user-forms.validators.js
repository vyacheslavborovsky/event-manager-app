import React from 'react';
import {TextField} from "react-md";

const passwordPatternDigit = /(?=.*\d)/g;
const passwordPatternLower = /(?=.*[a-z])/g;
const passwordPatternUpper = /(?=.*[A-Z])/g;
const passwordPatternSpecial = /(?=.*[!@#$%^&*])/;

const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Login Form
export const loginFormValidate = values => {
    const errors = {};

    if (!values['username']) {
        errors['username'] = errors['username'] || '' + 'Username is required field;';
    }

    if (!values['password']) {
        errors['password'] = errors['password'] || '' + 'Password is required field;';
    }

    return errors
};



// Register Form
export const signupFormValidate = values => {
    const errors = {};

    if (!values['username']) {
        errors['username'] = 'Username if required field;';
    } else if (values['username'].trim().length > 25) {
        errors['username'] = 'Username must to be up to 25 symbols;';
    }

    if (!values['password']) {
        errors['password'] = 'Password is required field;';
    } else {
        if (!passwordPatternDigit.test(values['password'])) {
            if (errors['password']) {
                errors['password'] = errors['password'] + 'Password should contain at least one digit;';
            } else {
                errors['password'] = 'Password should contain at least one digit;';
            }
        }

        if (!passwordPatternLower.test(values['password'])) {
            if (errors['password']) {
                errors['password'] = errors['password'] + 'Password should contain at least one lower character;';
            } else {
                errors['password'] = 'Password should contain at least one lower character;';
            }
        }

        if (!passwordPatternUpper.test(values['password'])) {
            if (errors['password']) {
                errors['password'] = errors['password'] + 'Password should contain at least one upper character;';
            } else {
                errors['password'] = 'Password should contain at least one upper character;';
            }
        }

        if (!passwordPatternSpecial.test(values['password'])) {
            if (errors['password']) {
                errors['password'] = errors['password'] + 'Password should contain at least one of special symbol (!@#$%^&*);';
            } else {
                errors['password'] = 'Password should contain at least one of special symbol (!@#$%^&*);';
            }
        }
    }

    if (!values['email']) {
        errors['email'] = 'Email address is required field;';
    } else if (!emailPattern.test(values['email'])) {
        errors['email'] = 'Email doesn\'t match to format;';
    }

    return errors
};


export const signupFormWarn = values => {
    const warnings = {};

    if (values['password']) {

        if (values['password'].trim().length <= 6) {
            warnings['password'] = 'Hmmm...low-security password:((;';
        } else if (values['password'].trim().length > 6
            && values['password'].trim().length <= 11) {
            warnings['password'] = 'Good, but not a strong password yet;';
        } else {
            warnings['password'] = 'Awesome, the super secret password found!;';
        }
    }

    return warnings
};


export const renderField = (props) => {
    return (
        <div className="col-8-center">
            <TextField
                {...props.input}
                id={props.id}
                name={props.name}
                label={props.label}
                type={props.type}
                lineDirection="center"
                placeholder={props.placeholder}
                className={"col"
                + (props.meta.touched && props.meta.error ? " input-error" : "")}/>
            {printMessages(props.meta)}
        </div>
    )
};

const printMessages = ({error, warning, touched}) => {
    let errors, warnings;

    if (error) {
        errors = error.split(';');
    }

    if (warning) {
        warnings = warning.split(';');
    }

    const displayMessages = (messages, messageClass) => {
        if (messages instanceof Array) {
            messages.pop();
            return (
                messages.map((message, index) => <h4 key={index} className={"message " + (message.includes('Awesome') ? 'info-message' : messageClass)}>{message}</h4>)
            )
        }
        return (
            <h4 className={"message " + (messages.includes('Awesome') ? 'info-message' : messageClass)}>{messages}</h4>
        )
    };

    return (
        (touched && (error && displayMessages(errors, 'error-message') || (warning && displayMessages(warnings, 'warning-message'))))
    )
};
