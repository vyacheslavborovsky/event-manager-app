import React from 'react';

import {Field, reduxForm, reset, formValueSelector} from "redux-form";
import {
    eventFormValidate, renderEventDateField,
    renderEventTextField, renderEventTimeField,
    renderEventLocationField, renderRadioBoxField
} from "../utils/events-form.validators";
import {Button, ExpansionList, ExpansionPanel} from "react-md";
import {connect} from "react-redux";

import '../styles/event-page.css';

let EventForm = (props) => {
    const onFormChange = (event) => {
        const {name, value} = event.target;

        switch (name) {
            case 'allDayEvent' : {
                updateTimeValues(value !== 'true');
                break;
            }
            default:
                break;
        }
    };

    const onDateChange = (propName, values) => {
        let dateString = '';
        Object.keys(values).forEach(key => {
            if (values.hasOwnProperty(key) && typeof values[key] === 'string') {
                dateString += values[key];
            }
        });

        if (dateString.length > 0) {
            if (props.formState.allDayEvent && isCurrentDate(dateString.split('/'), new Date())) {
                values.preventDefault();
                alert("You cannot set all day event to the current day.");
            }
        }
    };

    setTimeout(() => {
        if (props.formState['allDayEvent']) {
            const startTimeContainer = document.getElementById('startTimeContainer');
            const endTimeContainer = document.getElementById('endTimeContainer');

            startTimeContainer.className += ' disabled-item';
            endTimeContainer.className += ' disabled-item';
        }
    }, 1);

    const updateTimeValues = (isAllDayEvent) => {
        if (isAllDayEvent) {
            const startValues = '00:00:00:000'.split(':'), endValues = '23:59:59:999'.split(':');

            const startTimeValue = new Date(), endTimeValue = new Date();
            startTimeValue.setHours(startValues[0]);
            startTimeValue.setMinutes(startValues[1]);
            startTimeValue.setSeconds(startValues[2]);
            startTimeValue.setMilliseconds(startValues[3]);

            endTimeValue.setHours(endValues[0]);
            endTimeValue.setMinutes(endValues[1]);
            endTimeValue.setSeconds(endValues[2]);
            endTimeValue.setMilliseconds(endValues[3]);

            props.change('startTime', startTimeValue);
            props.change('endTime', endTimeValue);

            updateDateValue('startDate');
            updateDateValue('endDate');
        }

        const startTimeContainer = document.getElementById('startTimeContainer');
        const endTimeContainer = document.getElementById('endTimeContainer');

        if (isAllDayEvent) {
            startTimeContainer.className += ' disabled-item';
            endTimeContainer.className += ' disabled-item';
        } else {
            startTimeContainer.classList.remove('disabled-item');
            endTimeContainer.classList.remove('disabled-item');
        }
    };

    const updateDateValue = (propName) => {
        const now = new Date();

        if (!props.formState[propName]) {
            setNextDayDate(propName, now);
        } else {
            if (isCurrentDate(props.formState[propName].split('/'), now)) {
                setNextDayDate(propName, now);
            }
        }
    };

    const isCurrentDate = ([month, day, year], now) => {
        return Number.parseInt(month, 10) === now.getMonth() + 1 &&
            Number.parseInt(day, 10) === now.getDate() &&
            Number.parseInt(year, 10) === now.getFullYear()
    };

    const setNextDayDate = (propName, now) => {
        props.change(propName, `${now.getMonth() + 1}/${now.getDate() + 1}/${now.getFullYear()}`);
    };

    return (
        <div className={(props.isEventRequestPending ? 'disabled-item' : '')}>
            <form onSubmit={props.handleSubmit(props.onSubmit)} onChange={onFormChange}
                  className="grid-10-center-noGutter col-12">
                <div className="col-12-center">
                    <Field
                        id="title"
                        name="title"
                        label="Title *"
                        placeholder="title"
                        type="text"
                        component={renderEventTextField}/>
                </div>
                <div className="col-12-center">
                    <Field
                        id="description"
                        name="description"
                        label="Description *"
                        placeholder="description"
                        type="text"
                        component={renderEventTextField}/>
                </div>
                <div className="col-12-center grid-noGutter">
                    <Field
                        id="startDate"
                        name="startDate"
                        label="Start Date *"
                        placeholder="startDate"
                        onChange={e => onDateChange('startDate', e)}
                        component={renderEventDateField}/>
                    <Field
                        id="startTime"
                        name="startTime"
                        label="Start Time *"
                        placeholder="startTime"
                        component={renderEventTimeField}/>
                </div>
                <div className="col-12-center grid-noGutter">
                    <Field
                        id="endDate"
                        name="endDate"
                        label="End Date *"
                        onChange={e => onDateChange('endDate', e)}
                        placeholder="endDate"
                        component={renderEventDateField}/>
                    <Field
                        id="endTime"
                        name="endTime"
                        label="End Time *"
                        placeholder="endTime"
                        component={renderEventTimeField}/>
                </div>
                <div className="col-12 grid-noGutter">
                    <Field
                        id="allDayEvent"
                        type="switch"
                        name="allDayEvent"
                        defaultChecked={props.initialValues.allDayEvent === true}
                        label="All Day Event"
                        component={renderRadioBoxField}/>
                </div>

                <ExpansionList className='col-12-center grid-noGutter'>
                    <ExpansionPanel label="Add Location" className="col-12-center" footer={null}>
                        <Field
                            id="locationName"
                            name="locationName"
                            label="Location Name"
                            placeholder="locationName"
                            onClickLocationIcon={props.onClickLocationIcon}
                            isSelected={props.locationSelected}
                            locationCoords={props.locationCoords}
                            component={renderEventLocationField}/>
                    </ExpansionPanel>
                </ExpansionList>

                <div className="col-12 grid footer">
                    {!props.isEditingEvent &&
                    <Button
                        raised
                        primary
                        type="submit"
                        className="col-2"
                        disabled={props.invalid || props.pristine || props.submitting}>
                        Create
                    </Button>
                    }

                    {props.isEditingEvent &&
                    <Button
                        raised
                        type="submit"
                        className="col-2 md-text--theme-secondary"
                        disabled={props.invalid && props.dirty}>
                        Update
                    </Button>
                    }

                    {!props.isEventRequestPending &&
                    <div className="grid-12-noGutter-spaceAround col-8">
                        {props.isEventCreated &&
                        <h2 className="message success-message col-6">Event has been created.</h2>}
                        {props.isEventUpdated &&
                        <h2 className="message info-message col-6">Event's data has been updated.</h2>}
                        {!props.isEventUpdated || !props.isEventUpdated &&
                        <h2 className="message error-message col-6">{props.eventRequestMessage}</h2>}
                        <Button
                            flat
                            primary
                            className="md-text--theme-success col-4_xs-6_sm-6" onClick={props.openCalendar}>
                            Go To Calendar
                        </Button>
                    </div>
                    }

                    <Button
                        flat
                        className="col-2 md-text--theme-warning"
                        onClick={e => props.dispatch(reset('event'))}
                    >Reset</Button>
                </div>
            </form>
        </div>
    )
};

EventForm = reduxForm({
    form: 'event',
    validate: eventFormValidate,
    enableReinitialize: true,
    destroyOnUnmount: false
})(EventForm);


const eventFormSelector = formValueSelector('event');

export default EventForm = connect(
    state => {
        const startDate = eventFormSelector(state, 'startDate');
        const endDate = eventFormSelector(state, 'endDate');
        const startTime = eventFormSelector(state, 'startTime');
        const endTime = eventFormSelector(state, 'endTime');
        const allDayEvent = eventFormSelector(state, 'allDayEvent');

        return {
            formState: {
                startDate,
                endDate,
                startTime,
                endTime,
                allDayEvent
            }
        }
    })(EventForm);


