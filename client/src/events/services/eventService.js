import eventsActions from "../actions/eventsActions";
import moment from "moment";
import React from 'react';
import {Button} from "react-md";
import {httpServiceObj} from "../../common/services/httpService";
import {withAuthHeaders} from "../../common/constants/defaultHeaders";


export const eventServiceObj = {

    addEvent(body) {
        const data = {
            method: 'PATCH',
            headers: withAuthHeaders(),
            body: JSON.stringify(body)
        };

        return httpServiceObj.httpRequest('/events', data);
    },

    getEventById(eventId) {
        const data = {
            method: 'GET',
            headers: withAuthHeaders()
        };

        return httpServiceObj.httpRequest(`/events/${eventId}`, data);
    },

    getEvents() {
        const data = {
            method: 'GET',
            headers: withAuthHeaders()
        };

        return httpServiceObj.httpRequest('/events', data);
    },


    updateEvent(eventId, body) {
        const data = {
            method: 'POST',
            headers: withAuthHeaders(),
            body: JSON.stringify(body)
        };

        return httpServiceObj.httpRequest(`/events/${eventId}`, data);
    },


    deleteEvent(eventId) {
        const data = {
            method: "DELETE",
            headers: withAuthHeaders()
        };

        return httpServiceObj.httpRequest(`/events/${eventId}`, data);
    },

    deleteMultipleEvents(eventIds) {
        const data = {
            method: "DELETE",
            headers: withAuthHeaders(),
            body: JSON.stringify({eventIds: eventIds})
        };

        return httpServiceObj.httpRequest('/events', data);
    },

    getEmptyModalState() {
        return {
            title: "",
            titleClassName: "",
            isOpen: false,
            actions: [],
            content: ""
        }
    },

    getDeleteConfirmationModalConfig(confirmHandler, resetHandler) {
        const actions = [];
        actions.push(<Button raised secondary onClick={resetHandler}>Reject</Button>);
        actions.push(<Button flat className="md-text--theme-danger" onClick={confirmHandler}>Confirm</Button>);

        return {
            isOpen: true,
            title: "Delete event",
            titleClassName: "message warning-message",
            actions: actions,
            content: <h4 className="message">Are you sure you want to delete this event completely?</h4>
        }
    },

    getLocationDialogConfig(selectHandler, closeHandler) {
        const actions = [];
        actions.push(<Button flat className="md-text--theme-danger" onClick={e => closeHandler()}>Close</Button>);
        actions.push(<Button raised secondary onClick={selectHandler}>Confirm</Button>);

        return {
            isOpen: true,
            title: "Choose location",
            titleClassName: "message info-message",
            actions: actions
        }
    },

    getTabsConfig() {
        return [
            {
                key: 'Upcoming',
                label: 'Upcoming',
                dataKeyField: 'upcoming'
            },
            {
                key: 'Processing',
                label: 'In progress',
                dataKeyField: 'processing'
            },
            {
                key: 'Completed',
                label: 'Completed',
                dataKeyField: 'completed'
            }
        ]
    },

    getEventsColumnsConfig() {
        return [
            {
                key: 'eventId',
                label: 'Event ID',
                sortable: true,
                sortBy: 'eventId',
                colClass: 'col-1',
            },
            {
                key: 'title',
                label: 'Title',
                sortable: true,
                sortBy: 'title',
                colClass: 'col-2',
            },
            {
                key: 'description',
                label: 'Description',
                sortable: true,
                sortBy: 'description',
                colClass: 'col-1',
            },
            {
                key: 'startDate',
                label: 'Start Date',
                isDate: true,
                sortable: true,
                sortBy: 'startDate',
                getDynamicValue: (item) => moment(item.startDate).format('MM/DD/YYYY HH:mm:ss'),
                colClass: 'col-2',
            },
            {
                key: 'endDate',
                label: 'End Date',
                isDate: true,
                sortable: true,
                sortBy: 'endDate',
                getDynamicValue: (item) => {
                    return moment(item.endDate).format('MM/DD/YYYY HH:mm:ss')
                },
                colClass: 'col-2',
            },
            {
                key: 'duration',
                label: 'Duration',
                sortable: false,
                sortBy: '',
                getDynamicValue: (item) => {
                    const diff = moment.duration(moment(item.endDate).diff(moment(item.startDate)));
                    return `Days: ${diff['_data']['days']}, Hours: ${diff['_data']['hours']}, Minutes: ${diff['_data']['minutes']}`
                },
                colClass: 'col-2',
            },
            {
                key: 'location',
                label: 'Location',
                sortable: false,
                getDynamicValue: (item) => {
                    if (item['location'] && item['location']['locationName'] && item['location']['locationName'].length > 0) {

                        let lat = 'Not set';
                        let lng = 'Not set';

                        if (item['location']['lat']) {
                            lat = (Math.round(item['location']['lat'] * 10000) / 10000).toFixed(4);
                        }

                        if (item['location']['lng']) {
                            lng = (Math.round(item['location']['lng'] * 10000) / 10000).toFixed(4);
                        }

                        return `${item['location']['locationName']}: (${lat}-${lng})`;
                    }

                    return 'Not specified';
                },
                colClass: 'col-1',
            },
            {
                key: 'allDayEvent',
                label: 'All Day Event',
                sortable: false,
                sortBy: '',
                isGrow: true,
                getDynamicValue: (item) => item.allDayEvent ? 'Yes' : 'No',
                colClass: 'col-1',
            }
        ]
    },

    setStartDate(view, inputDate) {
        const now = new Date();

        if (view === 'month' && now.getMonth() === inputDate.getMonth() && now.getDate() === inputDate.getDate() && now.getDay() === inputDate.getDay() ) {
            return new Date(now.setHours(now.getHours() + 1));
        }

        return inputDate;
    },

    adjustDateRange(currentView, end) {
        let endDate = new Date(end);
        if (currentView === 'month') {
            endDate.setHours(endDate.getHours() + 23, 59, 59, 999);
        }

        return endDate;
    },

    closeInfoPanel(dispatch) {
        dispatch(eventsActions.setSelectedEvent(null));
    },

    goToEditView(router, eventId) {
        router.push(`/events/${eventId}`);
    }

};
