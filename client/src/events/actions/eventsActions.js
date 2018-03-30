import createAction from "redux-actions/es/createAction";

export const eventsActionTypes = {
    ADD_EVENT_REQUESTING: 'ADD_EVENT_REQUESTING',
    ADD_EVENT_SUCCESS: 'ADD_EVENT_SUCCESS',

    GET_EVENTS_REQUESTING: 'GET_EVENTS_REQUESTING',
    GET_EVENTS_SUCCESS: 'GET_EVENTS_SUCCESS',

    UPDATE_EVENT_REQUESTING: 'UPDATE_EVENT_REQUESTING',
    UPDATE_EVENT_SUCCESS: 'UPDATE_EVENT_SUCCESS',

    DELETE_EVENT_REQUESTING: 'DELETE_EVENT_REQUESTING',
    DELETE_EVENT_SUCCESS: 'DELETE_EVENT_SUCCESS',

    DELETE_MULTIPLE_EVENT_REQUESTING: 'DELETE_MULTIPLE_EVENT_REQUESTING',
    DELETE_MULTIPLE_EVENT_SUCCESS: 'DELETE_MULTIPLE_EVENT_SUCCESS',

    SORT_EVENTS: 'SORT_EVENTS',
    SET_SELECTED_EVENT: 'SET_SELECTED_EVENT',

    GET_SELECTED_EVENT_REQUESTING: 'GET_SELECTED_EVENT_REQUESTING',
    GET_SELECTED_EVENT_SUCCESS: 'GET_SELECTED_EVENT_SUCCESS',


    RESET_REQUESTS_RESULT: 'RESET_REQUESTS_RESULT',

    EVENT_REQUEST_SUCCESS: 'EVENT_REQUEST_SUCCESS'
};

export default {
    setAddEventRequesting: createAction(eventsActionTypes.ADD_EVENT_REQUESTING),
    setAddEventSuccess: createAction(eventsActionTypes.ADD_EVENT_SUCCESS),

    setGetEventsRequesting: createAction(eventsActionTypes.GET_EVENTS_REQUESTING),
    setGetEventsSuccess: createAction(eventsActionTypes.GET_EVENTS_SUCCESS),

    setUpdateEventRequesting: createAction(eventsActionTypes.UPDATE_EVENT_REQUESTING),
    setUpdateEventSuccess: createAction(eventsActionTypes.UPDATE_EVENT_SUCCESS),

    setDeleteEventRequesting: createAction(eventsActionTypes.DELETE_EVENT_REQUESTING),
    setDeleteEventSuccess: createAction(eventsActionTypes.DELETE_EVENT_SUCCESS),

    setDeleteMultipleEventsRequesting: createAction(eventsActionTypes.DELETE_MULTIPLE_EVENT_REQUESTING),
    setDeleteMultipleEventsSuccess: createAction(eventsActionTypes.DELETE_MULTIPLE_EVENT_SUCCESS),

    setSortEvents: createAction(eventsActionTypes.SORT_EVENTS),
    setSelectedEvent: createAction(eventsActionTypes.SET_SELECTED_EVENT),

    setGetSelectedEventRequesting: createAction(eventsActionTypes.GET_SELECTED_EVENT_REQUESTING),
    setGetSelectedEventSuccess: createAction(eventsActionTypes.GET_SELECTED_EVENT_SUCCESS),

    resetEventsFlags: createAction(eventsActionTypes.RESET_REQUESTS_RESULT),

    setEventRequestSuccess: createAction(eventsActionTypes.EVENT_REQUEST_SUCCESS),
};
