import React from 'react';
import {Button, DatePicker, SelectionControl, TextField, TimePicker} from "react-md";


import moment from 'moment';

export const eventFormValidate = (values) => {
    const errors = {};

    // Title validation
    if (!values['title']) {
        errors['title'] = 'Title is required';
    } else if (values['title'].trim().length > 25) {
        errors['title'] = 'Title must to be up to 25 characters';
    }

    // Description validation
    if (!values['description']) {
        errors['description'] = 'Description is required';
    } else if (values['description'].trim().length > 100) {
        errors['title'] = 'Description must to be up to 100 characters';
    }


    // Start Date validation
    if (!values['startDate']) {
        errors['startDate'] = 'Start Date is required';
    } else if (moment(values['startDate']).isBefore(moment(new Date()), 'day')) {
        errors['startDate'] = 'Start date must be today or future date';
    }

    if (!values['startTime']) {
        errors['startTime'] = 'Start Time is required';
    } else if (!errors['startDate'] && moment(values['startDate']).isSame(moment(new Date()), 'day')) {
        if (typeof values['startTime'] === 'string') {
            const [startHour, startMinute] = values['startTime'].split(':');

            const startTime = new Date();
            startTime.setHours(startHour);
            startTime.setMinutes(startMinute);

            const minuteDiff = moment(moment(startTime).diff(moment(new Date()), 'minutes'));

            let hourDuration = Math.floor(minuteDiff / 60);

            if (hourDuration < 1) {
                errors['startTime'] = 'Event must be scheduled at least one hour forward from now';
            }
        }
    }

    // End Date validation
    if (!values['endDate']) {
        errors['endDate'] = 'End Date is required';
    } else if (!errors['endDate']) {
        if (moment(values['endDate']).isBefore(moment(values['startDate']), 'day')) {
            errors['endDate'] = 'End Date must be greater than Start Date';
        }
    }

    if (!values['endTime']) {
        errors['endTime'] = 'End Time is required';
    } else if (moment(values['endDate']).isSame(moment(values['startDate']), 'day')
        && typeof values['startTime'] === 'string' &&
        typeof values['endTime'] === 'string') {

        const [startHour, startMinute] = values['startTime'].split(':');
        const [endHour, endMinute] = values['endTime'].split(':');

        if ((startHour === endHour && Number.parseInt(startMinute, 10) >= Number.parseInt(endMinute, 10))
            || (Number.parseInt(startHour, 10) > (Number.parseInt(endHour, 10)))) {
            errors['endTime'] = 'End Time should be greater than Start Time';
        }

    }

    // Location info validation
    if (values['locationName'] && values['locationName'].trim().length > 40) {
        errors['locationName'] = 'Location name must be up to 40 characters';
    }

    return errors
};


export const renderEventTextField = (props) => {
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
            {props.meta.touched &&
            ((props.meta.error && <span className="message error-message">{props.meta.error}</span>) ||
                (props.meta.warning && <span className="message warning-message">{props.meta.warning}</span>))}
        </div>
    )
};

export const renderEventLocationField = (props) => {
    return (
        <div className="">
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
            {props.meta.touched &&
            ((props.meta.error && <span className="message error-message">{props.meta.error}</span>) ||
                (props.meta.warning && <span className="message warning-message">{props.meta.warning}</span>))}
            <div className="grid-noGutter">
                <Button
                    icon
                    className="location-btn col-1-center"
                    tooltipLabel="Open Map"
                    tooltipPosition="right"
                    onClick={props.onClickLocationIcon}
                >room</Button>
                {props.locationCoords && <h3 className="message col-8"><span className="info-message">Coordinates:</span> <span className="warning-message">{props.locationCoords.lat}</span> - <span className="warning-message">{props.locationCoords.lng}</span></h3>}
            </div>
        </div>
    )
};


export const renderEventDateField = (props) => {
    let dateValue = null;

    if (props.input.value && props.input.value.length > 0) {
        const [month, day, year] = props.input.value.split('/');
        dateValue = new Date(Date.UTC(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, Number.parseInt(day, 10)));
    }

    return (
        <div className="col-6-center">
            <DatePicker
                {...props.input}
                id={props.id}
                name={props.name}
                label={props.label}
                placeholder={props.placeholder}
                value={dateValue}
                locales="en-US"
                showAllDays
                disableOuterDates
                inline
                className={"col"
                + (props.meta.dirty && props.meta.error ? " input-error" : "")}
            />
            {props.meta.dirty &&
            ((props.meta.error && <span className="message error-message">{props.meta.error}</span>) ||
                (props.meta.warning && <span className="message warning-message">{props.meta.warning}</span>))}
        </div>
    )
};

export const renderEventTimeField = (props) => {
    let timeValue = null;

    if (typeof props.input.value === 'string' && props.input.value !== '') {
        const values = props.input.value.split(':');

        timeValue = new Date();
        timeValue.setHours(values[0]);
        timeValue.setMinutes(values[1]);
    } else if (typeof props.input.value === 'object') {
        timeValue = new Date(props.input.value)
    }

    return (
        <div id={props.id + "Container"} className="col-6-center">
            <TimePicker
                {...props.input}
                id={props.id}
                name={props.name}
                label={props.label}
                placeholder={props.placeholder}
                value={timeValue}
                inline
                className={"col"
                + (props.meta.dirty && props.meta.error ? " input-error" : "")}
            />
            {props.meta.dirty &&
            ((props.meta.error && <span className="message error-message">{props.meta.error}</span>) ||
                (props.meta.warning && <span className="message warning-message">{props.meta.warning}</span>))}
        </div>
    )
};

export const renderRadioBoxField = (props) => {
    return (
        <div className="col-6">
            <SelectionControl
                {...props.input}
                id={props.id}
                type={props.type}
                label={props.label}
                defaultChecked={props.defaultChecked}
            />
        </div>
    )
};
