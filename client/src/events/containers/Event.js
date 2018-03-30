import EventForm from "../components/EventForm";
import eventsActions from "../actions/eventsActions";
import Loader from "../../common/components/Loader";
import loader from '../../assets/earth-loader.svg';
import React, {PureComponent, Fragment} from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {Card, CardText, CardTitle, DialogContainer} from "react-md";
import {connect} from "react-redux";
import {getDerivedEventData} from "../shared/eventSelector";
import {withRouter} from "react-router-dom";
import {eventServiceObj} from "../services/eventService";


import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import '../../../node_modules/leaflet/dist/leaflet.css';
import '../styles/event-page.css';

import L from 'leaflet';
import {helperServiceObj} from "../../common/services/helperService";
import appConfig from "../../common/constants/config";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: icon2x,
    iconUrl: icon,
    shadowUrl: iconShadow,
});

class Event extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            locationSelected: false,
            dialogConfig: {
                title: "",
                titleClassName: "",
                isOpen: false,
                actions: []
            },
            mapCenter: {
                lat: null,
                lng: null
            },
            leaftletUrl: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=${appConfig.leafleatToken}`,
            draggableMarker: true,
            markerPosition: {
                lat: null,
                lng: null
            }
        }
    }

    componentWillMount() {
        if (this.props.eventsState.shouldFetchEvent) {
            this.props.dispatch(eventsActions.setGetSelectedEventRequesting({
                eventId: this.props.eventsState.eventId,
                userId: this.props.userId
            }));
        }
    }

    componentDidMount() {
        const Minks = [53.9, 27.5667];
        const {selectedEvent} = this.props.eventsState;

        if (selectedEvent && selectedEvent.location && selectedEvent.location.lat) {
            this.setState({
                mapCenter: {
                    lat: selectedEvent.location.lat,
                    lng: selectedEvent.location.lng
                },
                markerPosition: {
                    lat: selectedEvent.location.lat,
                    lng: selectedEvent.location.lng
                }
            });
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        this.setState({
                            mapCenter: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            },
                            markerPosition: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        });
                    },
                    error => {
                        console.error(`ERROR(${error.code}): ${error.message}`);
                    });
            } else {
                this.setState({
                    mapCenter: {
                        lat: Minks[0],
                        lng: Minks[1]
                    },
                    markerPosition: {
                        lat: Minks[0],
                        lng: Minks[1]
                    }
                });
            }
        }
    }

    componentWillUnmount() {
        //this.props.dispatch(eventsActions.resetRequestResults());
    }

    handleSubmit = (values) => {
        const body = {
            title: values['title'].trim(),
            description: values['description'].trim(),
            allDayEvent: values['allDayEvent'],
            startDate: helperServiceObj.prepareEventDatesForSave('startDate', 'startTime', values),
            endDate: helperServiceObj.prepareEventDatesForSave('endDate', 'endTime', values),
            userId: this.props.userId
        };

        if (values['locationName'] || this.state.locationSelected) {
            body['location'] = {};
            body['location']['locationName'] = values['locationName'] || 'Default Name';

            if (this.state.locationSelected) {
                body['location']['lat'] = this.state.markerPosition.lat;
                body['location']['lng'] = this.state.markerPosition.lng;
            }
        }

        if (this.state.locationSelected) {
            if (!body['location']) {
                body['location'] = {};
            }
        }

        if (this.props.eventsState.isEditingEvent) {
            this.props.dispatch(eventsActions.setUpdateEventRequesting({
                body: body,
                eventId: this.props.eventsState.selectedEvent.eventId
            }));
        } else {
            this.props.dispatch(eventsActions.setAddEventRequesting(body));
        }
    };

    openMapDialog = () => {
        const dialogConfig = eventServiceObj.getLocationDialogConfig(this.selectEventLocation, this.closeDialog);
        this.setState({
            dialogConfig: dialogConfig,
        });
    };

    selectEventLocation = () => {
        this.closeDialog(true);
    };

    closeDialog = (locationSelected = false) => {
        this.setState({
            locationSelected: locationSelected,
            dialogConfig: {
                title: "",
                titleClassName: "",
                isOpen: false,
                actions: []
            }
        })
    };

    openCalendar = () => {
        this.props.history.push('/events-calendar');
    };

    updatePosition = () => {
        const {lat, lng} = this.refs.marker.leafletElement.getLatLng();
        this.setState({
            markerPosition: {lat, lng},
        })
    };

    renderMarker = () => {
        return (
            <Marker
                ref="marker"
                draggable={this.state.draggableMarker}
                onDragend={this.updatePosition}
                position={[this.state.markerPosition.lat, this.state.markerPosition.lng]}>
                <Popup>
                    <span className="popup-message">You selected it!</span>
                </Popup>
            </Marker>
        )
    };

    onMapClick = (event) => {
        this.setState({
            markerPosition: event.latlng
        });
        this.refs.map.leafletElement.locate();
    };

    render() {
        const {invalidEventId, selectedEvent, isEventRequestPending, isEventCreated, isEventUpdated, eventRequestMessage, isEditingEvent} = this.props.eventsState;
        const {isOpen, title, titleClassName, actions} = this.state.dialogConfig;
        const {mapCenter, leaftletUrl, locationSelected, markerPosition} = this.state;

        return (
            <Fragment>
                {selectedEvent &&
                <Card
                    className={"grid-noGutter-center-middle event-container md-paper--5" + (isEventRequestPending ? " disabled-item" : "")}>
                    <CardTitle
                        title="Event Page"
                        subtitle="Manage of your event properties quickly"
                        className="grid-6-center col-12"
                    />
                    <CardText className="grid-noGutter-center-middle">
                        {invalidEventId && <h3 className="message info-message">Couldn't find event.</h3>}
                        {!invalidEventId &&
                        <EventForm
                            initialValues={selectedEvent}
                            onSubmit={values => this.handleSubmit(values)}
                            locationSelected={locationSelected}
                            isEditingEvent={isEditingEvent}
                            isEventRequestPending={isEventRequestPending}
                            isEventCreated={isEventCreated}
                            isEventUpdated={isEventUpdated}
                            eventRequestMessage={eventRequestMessage}
                            locationCoords={markerPosition}
                            onClickLocationIcon={this.openMapDialog}
                            openCalendar={this.openCalendar}
                        />
                        }
                    </CardText>
                </Card>
                }

                {isEventRequestPending && <Loader loaderSrc={loader} size="250px" loadingText="Processing..."/>}

                <DialogContainer
                    id="location"
                    title={title}
                    actions={actions}
                    titleClassName={titleClassName}
                    visible={isOpen}
                    onHide={this.closeDialog}
                    contentClassName="grid-noGutter col-12-center map-container">
                    <Map
                        center={mapCenter}
                        onClick={this.onMapClick}
                        ref="map"
                        zoom={15}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url={leaftletUrl}
                        />
                        {this.renderMarker()}
                    </Map>
                </DialogContainer>
            </Fragment>
        )
    }
}

const mapStateToProps = () => (state, ownProps) => {
    const eventId = ownProps.match.params['eventId'];
    return getDerivedEventData(eventId, state.eventsState, state.authState.sessionUser)(state, ownProps)
};

export default connect(mapStateToProps)(withRouter(Event));
