import appState from "../../app/model/appTreeModel";
import handleActions from "redux-actions/es/handleActions";
import {eventsActionTypes} from '../actions/eventsActions'
import combineActions from "redux-actions/es/combineActions";

import * as _ from 'lodash';

const defaultState = {
    ...appState.eventsState
};

const eventsReducer = handleActions({
    [combineActions(
        eventsActionTypes.GET_EVENTS_REQUESTING,
        eventsActionTypes.ADD_EVENT_REQUESTING,
        eventsActionTypes.DELETE_EVENT_REQUESTING,
        eventsActionTypes.UPDATE_EVENT_REQUESTING,
        eventsActionTypes.GET_SELECTED_EVENT_REQUESTING,
        eventsActionTypes.DELETE_MULTIPLE_EVENT_REQUESTING
    )]: (state, action) => ({
            ...state,
            isEventRequestPending: true
        }
    ),

    [eventsActionTypes.GET_EVENTS_SUCCESS]: (state, action) => ({
        ...state,
        data: action['payload']['events'],
        isEventRequestPending: false,
    }),

    [eventsActionTypes.ADD_EVENT_SUCCESS]: (state, action) => {
        let result = {
            ...state,
            isEventRequestPending: false
        };

        if (!action['payload']['isError']) {
            result['selectedEvent'] = action['payload']['event'];
            result['data'] = [
                ...state.data || [],
                action['payload']['event'],
            ]
        }

        result['isEventCreated'] = !action['payload']['isError'];
        return result
    },

    [eventsActionTypes.UPDATE_EVENT_SUCCESS]: (state, action) => {
        let result = {
            ...state,
            isEventRequestPending: false
        };

        if (!action['payload']['isError']) {
            if (state.data) {
                let currentEvents = state.data.slice();
                const findIndex = _.findIndex(currentEvents, (item) => item.eventId === action.payload['event'].eventId);

                if (findIndex > -1) {
                    currentEvents[findIndex] = action.payload['event']
                }
                result['selectedEvent'] = action.payload['event'];
                result['data'] = [...currentEvents];
            } else {
                result['data'] = [...action.payload['event']];
            }
        }

        result['isEventUpdated'] = !action['payload']['isError'];
        return result;
    },

    [eventsActionTypes.DELETE_EVENT_SUCCESS]: (state, action) => ({
        ...state,
        data: [
            ...state.data.filter(event => event['eventId'] !== action['payload']['eventId'])
        ],
        isEventRequestPending: false
    }),

    [eventsActionTypes.SORT_EVENTS]: (state, action) => ({
        ...state,
        manageUI: {
            ascending: action['payload']['sortColumn'] === state.manageUI.sortColumn ? !state.manageUI.ascending : true,
            sortColumn: action['payload']['sortColumn']
        }
    }),

    [eventsActionTypes.SET_SELECTED_EVENT]: (state, action) => ({
        ...state,
        selectedEvent: action['payload']
    }),

    [eventsActionTypes.GET_SELECTED_EVENT_SUCCESS]: (state, action) => ({
        ...state,
        selectedEvent: action['payload']['event'],
        isGetSelectedEventSuccess: action['payload']['success'],
        isEventRequestPending: false
    }),

    [eventsActionTypes.RESET_REQUESTS_RESULT]: (state, action) => ({
        ...state,
        isGetSelectedEventSuccess: null,

        isEditingEvent: null,

        isEventCreated: null,
        isEventUpdated: null,
        isEventRemoved: null,

        isEventRequestSuccess: null
    }),

    [eventsActionTypes.EVENT_REQUEST_SUCCESS]: (state, action) => ({
        ...state,
        isEventRequestSuccess: action['payload']['isEventRequestSuccess'],
        eventRequestMessage: action['payload']['message'],
        isEventRequestPending: false
    }),

    [eventsActionTypes.DELETE_MULTIPLE_EVENT_SUCCESS]: (state, action) => {
        const filteredEvents = state.data.filter(event => !action.payload.eventIds.includes(event.eventId));

        return {
            ...state,
            isEventRequestPending: false,
            data: filteredEvents
        }
    }

}, defaultState);

export default eventsReducer;
