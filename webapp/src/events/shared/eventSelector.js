import {createSelector} from 'reselect';
import {defaultEventValues} from "./defaultEventValues";
import moment from "moment";

import * as _ from 'lodash';
import {helperServiceObj} from "../../common/services/helperService";

export const getEvents = state => state.eventsState.data;

export const getDerivedEventData = (eventId, eventsState, sessionUser) => createSelector(
    [getEvents],
    (events) => {
        const eventPageData = {
            ...eventsState,
            invalidEventId: false,
        };

        if (eventId !== 'new') {
            if (events !== null && events.length > 0) {
                const selectedEvent = events.filter(event => event.eventId === eventId);

                if (selectedEvent.length > 0) {
                    let foundEvent = Object.assign({}, selectedEvent[0]);
                    foundEvent = helperServiceObj.prepareDatesForEditing(['start', 'end'], foundEvent);
                    foundEvent = helperServiceObj.prepareLocationName(foundEvent);

                    eventPageData['selectedEvent'] = foundEvent;
                    eventPageData['isEditingEvent'] = true;
                } else {
                    eventPageData['invalidEventId'] = true;
                    eventPageData['isEditingEvent'] = false;
                }
            } else {
                if (eventsState.isGetSelectedEventSuccess === null) {
                    eventPageData['shouldFetchEvent'] = true;
                    eventPageData['eventId'] = eventId;
                } else if (eventsState.isGetSelectedEventSuccess === true) {
                    let foundEvent = Object.assign({}, eventsState.selectedEvent);
                    foundEvent = helperServiceObj.prepareDatesForEditing(['start', 'end'], foundEvent);
                    foundEvent = helperServiceObj.prepareLocationName(foundEvent);

                    eventPageData['selectedEvent'] = foundEvent;
                    eventPageData['isEditingEvent'] = true;
                } else {
                    eventPageData['invalidEventId'] = true;
                    eventPageData['isEditingEvent'] = false;
                }
            }
        } else {
            eventPageData['selectedEvent'] = defaultEventValues;
        }

        return {
            eventsState: eventPageData,
            userId: sessionUser._id,
        }
    }
);

export const getMangeUIEventsData = (eventsState, authState) => createSelector(
    [getEvents],
    (events) => {
        const pageData = {
            ...eventsState,
        };

        const momentNow = moment(new Date());
        const sortedEvents = _.orderBy(events, [eventsState.manageUI.sortColumn], [eventsState.manageUI.ascending ? 'asc' : 'desc']);

        let completedEvents = sortedEvents.filter(event => moment(event.endDate).isBefore(momentNow));
        let upcomingEvents = sortedEvents.filter(event => moment(event.startDate).isAfter(momentNow));
        let processingEvents = sortedEvents.filter(event => momentNow.isBetween(moment(event.startDate), moment(event.endDate)));

        return {
            eventsState: {
                ...pageData,
                manageUI: {
                    ...pageData.manageUI,
                    upcoming: upcomingEvents,
                    processing: processingEvents,
                    completed: completedEvents
                }
            },
            authState: {
                userId: authState.sessionUser._id,
                isLoginSuccess: authState.isLoginSuccess
            }
        }
    }
);

