import BigCalendar from 'react-big-calendar';
import commonActions from "../../common/actions/commonActions";
import EventInfoPanel from "../components/EventsInfoPanel";
import eventsActions from "../actions/eventsActions";
import Loader from "../../common/components/Loader";
import loader from '../../assets/ring-loader.svg';
import moment from 'moment';
import React, {PureComponent, Fragment} from 'react';
import TweetsBox from "../../common/containers/TweetsBox";
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import withRouter from "react-router-dom/es/withRouter";
import {connect} from "react-redux";
import {DialogContainer} from "react-md";
import {eventServiceObj} from "../services/eventService";
import {Redirect} from "react-router-dom";
import {storageServiceObj} from "../../common/services/storageService";

import '../styles/events-grid.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

class EventsGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentView: 'month',
            defaultDate: new Date(),
            modalState: eventServiceObj.getEmptyModalState()
        };
    }

    componentWillMount() {
        if (storageServiceObj.hasStorageValueByKey('token')) {
            this.props.dispatch(eventsActions.setGetEventsRequesting());
        }
    }

    componentWillUnmount() {
        this.props.dispatch(eventsActions.resetEventsFlags());
    }

    clearTweetsBox = () => {
        this.props.dispatch(commonActions.setClearTweets());
    };

    handleViewChange = (currentView) => {
        this.setState({
            currentView: currentView
        });
    };

    moveEvents = ({event, start, end}) => {
        if (moment(start).isBefore(moment(new Date()), 'day')) {
            alert('You cannot move event to the past')
        } else {
            const body = {
                startDate: start,
                endDate: end,
            };

            this.setState({
                defaultDate: start
            });

            this.props.dispatch(eventsActions.setUpdateEventRequesting({body: body, eventId: event.eventId,}));
        }
    };

    onSelectEvent = (event) => {
        const {selectedEvent} = this.props.eventsState;
        if (selectedEvent && selectedEvent.eventId === event.eventId) {

        } else {
            this.props.dispatch(eventsActions.setSelectedEvent(event));
        }
    };

    showDeleteConfirmationDialog = () => {
        const dialogConfig = eventServiceObj.getDeleteConfirmationModalConfig(this.deleteEvent, this.closeDialog);
        this.setState({
            modalState: dialogConfig,
        });
    };

    deleteEvent = () => {
        this.props.dispatch(eventsActions.setDeleteEventRequesting({
            eventId: this.props.eventsState.selectedEvent.eventId
        }));

        this.props.dispatch(eventsActions.setSelectedEvent(null));
        this.closeDialog();
    };

    closeDialog = () => {
        this.setState({
            modalState: eventServiceObj.getEmptyModalState()
        })
    };

    onSelectTimeRange = (slotData) => {
        if (moment(slotData.start).isBefore(moment(new Date()), 'day')) {
            alert('You cannot create event in the past')
        } else {
            const body = {
                startDate: eventServiceObj.setStartDate(this.state.currentView, slotData.start),
                endDate: eventServiceObj.adjustDateRange(this.state.currentView, slotData.end),
                title: "Default title",
                description: "No description",
                allDayEvent: false
            };

            this.setState({
                defaultDate: slotData.start
            });

            this.props.dispatch(eventsActions.setAddEventRequesting(body));
        }
    };

    resizeEvent = (resizeType, {event, end}) => {
        const body = {
            startDate: event.startDate,
            endDate: eventServiceObj.adjustDateRange(this.state.currentView, end)
        };

        this.setState({
            defaultDate: event.startDate
        });

        this.props.dispatch(eventsActions.setUpdateEventRequesting({body: body, eventId: event.eventId}));
    };

    render() {
        const {data, isEventRequestPending, selectedEvent, eventRequestMessage} = this.props.eventsState;
        const {tweets, showTweetsBox} = this.props.commonState;
        const {defaultDate, currentView, modalState} = this.state;

        const {from} = this.props.location.state || {from: {pathname: '/login'}};

        if (!this.props.isLoginSuccess) {
            return (
                <Redirect to={from}/>
            )
        }

        if (isEventRequestPending === true) {
            return (
                <Loader loaderSrc={loader} size="300px" loadingText="Processing..."/>
            )
        }

        if (data && isEventRequestPending === false) {
            return (
                <Fragment>
                    {showTweetsBox && <TweetsBox tweets={tweets} clearTweetsBox={this.clearTweetsBox}/>}
                    <DragAndDropCalendar
                        selectable
                        resizable
                        popup={true}
                        popupOffset={{x: 30, y: 20}}
                        events={data}
                        allDayAccessor="allDayEvent"
                        startAccessor="startDate"
                        endAccessor="endDate"
                        onEventDrop={this.moveEvents}
                        onEventResize={this.resizeEvent}
                        defaultView={currentView}
                        views={['month', 'week', 'day']}
                        onView={this.handleViewChange}
                        defaultDate={defaultDate}
                        onSelectEvent={this.onSelectEvent}
                        onSelectSlot={this.onSelectTimeRange}
                    />
                    <DialogContainer
                        id="modal"
                        visible={modalState.isOpen}
                        onHide={this.closeDialog}
                        actions={modalState.actions}
                        title={modalState.title}
                        titleClassName={modalState.titleClassName}>
                        {modalState.content}
                    </DialogContainer>
                    {selectedEvent &&
                    <EventInfoPanel
                        event={selectedEvent}
                        deleteHandler={this.showDeleteConfirmationDialog}
                        editHandler={e => eventServiceObj.goToEditView(this.props.history, selectedEvent.eventId)}
                        closePanel={e => eventServiceObj.closeInfoPanel(this.props.dispatch)}
                    />
                    }
                </Fragment>
            )
        }

        return (
            <h1 className="message danger-message">Error on this page: {eventRequestMessage}</h1>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoginSuccess: state.authState.isLoginSuccess,
        eventsState: state.eventsState,
        commonState: state.commonState
    }
};

export default connect(mapStateToProps)(withRouter(EventsGrid));
