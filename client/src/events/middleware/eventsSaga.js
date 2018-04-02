import commonActions from "../../common/actions/commonActions";
import eventsActions from "../actions/eventsActions";
import {call, take, put, fork} from "redux-saga/effects";
import {eventsActionTypes} from "../actions/eventsActions";
import {eventServiceObj} from "../services/eventService";
import {batchActions} from 'redux-batched-actions';


function* getEvents() {
    try {
        const response = yield call(eventServiceObj.getEvents);
        const events = response['events'].map(item => {
            item['startDate'] = new Date(item['startDate']);
            item['endDate'] = new Date(item['endDate']);

            return item;
        });

        yield put(batchActions([
            eventsActions.setGetEventsSuccess({events: events}),
            commonActions.setAddToastMessage({text: "Your events have been loaded successfully"})
        ]));
    } catch (error) {
        yield put(batchActions([
            eventsActions.setEventRequestSuccess({
                isEventRequestSuccess: false,
                message: 'Server error during get events'
            }),
            commonActions.setAddToastMessage({text: "An Error occurred during loading events."})
        ]))
    }
}

function* getEventsFlow() {
    while (true) {
        yield take(eventsActionTypes.GET_EVENTS_REQUESTING);
        yield call(getEvents);
    }
}


function* removeEvent({eventId}) {
    try {
        const response = yield call(eventServiceObj.deleteEvent, eventId);


        yield put(batchActions([
            eventsActions.setDeleteEventSuccess({eventId: eventId}),
            eventsActions.setEventRequestSuccess({isEventRequestSuccess: true, message: response['message']}),
            commonActions.setAddToastMessage({text: `Event "${response.event.title}" has been removed.`})
        ]));
    } catch (error) {
        yield put(batchActions([
            eventsActions.setEventRequestSuccess({
                isEventRequestSuccess: false,
                message: 'Server error during deleting event'
            }),
            commonActions.setAddToastMessage({text: "Error during deleting the event."})
        ]));
    }
}


function* deleteEventFlow() {
    while (true) {
        const action = yield take(eventsActionTypes.DELETE_EVENT_REQUESTING);
        yield call(removeEvent, action['payload']);
    }
}


function* updateEvent({body, eventId}) {
    try {
        const response = yield call(eventServiceObj.updateEvent, eventId, body);

        const event = {
            ...response['event'],
            startDate: new Date(response['event'].startDate),
            endDate: new Date(response['event'].endDate)
        };

        yield put(batchActions([
            eventsActions.setUpdateEventSuccess({event: event, isError: false}),
            commonActions.setAddToastMessage({text: `Event "${event.title}" has been updated.`})
        ]));
    } catch (error) {
        yield put(batchActions([
            eventsActions.setEventRequestSuccess({
                isEventRequestSuccess: false,
                message: 'Server error during updating event'
            }),
            commonActions.setAddToastMessage({text: "Error during updating the event."})
        ]));
    }
}


function* updateEventFlow() {
    while (true) {
        const action = yield take(eventsActionTypes.UPDATE_EVENT_REQUESTING);
        yield call(updateEvent, action['payload']);
    }
}


function* createEvent(body) {
    try {
        const response = yield call(eventServiceObj.addEvent, body);

        const event = {
            ...response['event'],
            startDate: new Date(response['event'].startDate),
            endDate: new Date(response['event'].endDate)
        };

        yield put(batchActions([
            eventsActions.setAddEventSuccess({event: event, isError: false}),
            commonActions.setAddToastMessage({text: `Event "${event.title}" has been created.`})
        ]));
    } catch (error) {
        yield put(batchActions([
            eventsActions.setAddEventSuccess({event: null, isError: true}),
            commonActions.setAddToastMessage({text: "Error during creating the event."})
        ]));
    }
}

function* addEventFlow() {
    while (true) {
        const action = yield take(eventsActionTypes.ADD_EVENT_REQUESTING);
        yield call(createEvent, action['payload']);
    }
}

function* getEventById({eventId}) {
    try {
        const response = yield call(eventServiceObj.getEventById, eventId);

        const event = {
            ...response['event'],
            startDate: new Date(response['event'].startDate),
            endDate: new Date(response['event'].endDate)
        };

        yield put(batchActions([
            eventsActions.setGetSelectedEventSuccess({event: event, success: true}),
            eventsActions.setEventRequestSuccess({isEventRequestSuccess: true, message: response['message']})
        ]));
    } catch (error) {
        yield put(batchActions([
            eventsActions.setGetSelectedEventSuccess({event: null, success: false}),
            commonActions.setAddToastMessage({text: "Error during fetching the event."})
        ]));
    }
}

function* getSingleEventFlow() {
    while (true) {
        const action = yield take(eventsActionTypes.GET_SELECTED_EVENT_REQUESTING);
        yield call(getEventById, action['payload']);
    }
}

function* removeEventsByIds({eventIds}) {
    try {
        const response = yield call(eventServiceObj.deleteMultipleEvents, eventIds);

        yield put(batchActions([
            eventsActions.setDeleteMultipleEventsSuccess({eventIds: eventIds}),
            eventsActions.setEventRequestSuccess({isEventRequestSuccess: true, message: response['message']}),
            commonActions.setAddToastMessage({text: "Events have been deleted successfully."})
        ]));
    } catch (err) {
        yield put(batchActions([
            commonActions.setAddToastMessage({text: "Error during deleting multiple events."})
        ]));
    }
}

function* deleteMultipleEventsFlow() {
    while (true) {
        const action = yield take(eventsActionTypes.DELETE_MULTIPLE_EVENT_REQUESTING);
        yield call(removeEventsByIds, action['payload']);
    }
}

// MAIN EVENTS WATCHER
function* EventsWatcher() {
    yield fork(getEventsFlow);
    yield fork(addEventFlow);
    yield fork(deleteEventFlow);
    yield fork(deleteMultipleEventsFlow);
    yield fork(updateEventFlow);
    yield fork(getSingleEventFlow);
}

export default EventsWatcher
