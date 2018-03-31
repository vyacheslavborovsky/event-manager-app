const eventsState = {
    data: null,
    selectedEvent: null,

    // CRUD FLAGS
    isEventCreated: null,
    isEventUpdated: null,
    isEventRemoved: null,
    
    isGetSelectedEventSuccess: null,
    isEditingEvent: false,

    manageUI: {
        nextUrl: null,
        ascending: true,
        sortColumn: 'startDate'
    },

    isEventRequestPending: null,
    isEventRequestSuccess: null,
    eventRequestMessage: null,
};

export default eventsState;
