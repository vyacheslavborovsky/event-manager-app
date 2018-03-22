import React from 'react';
import {Button} from "react-md";
import moment from 'moment';
import TooltipIcon from '../../common/containers/TooptipIcon';

import '../styles/event-panel.css';

let EventInfoPanel = ({event, deleteHandler, editHandler, closePanel}) => {

    const getEventStatus = (event) => {
        const now = new Date();

        if (event.startDate.getTime() <= now.getTime() && event.endDate.getTime() >= now.getTime()) {
            return 'In progress';
        }

        if (event.endDate.getTime() < now.getTime()) {
            return 'Completed ' + moment(event.endDate).startOf('day').fromNow();
        }

        if (event.startDate.getTime() > now.getTime()) {
            return 'Scheduled';
        }
    };

    const calculateDurationEvent = (event) => {
        const diff = moment.duration(moment(event.endDate).diff(moment(event.startDate)));

        return `Days: ${diff['_data']['days']}, Hours: ${diff['_data']['hours']}, Minutes: ${diff['_data']['minutes']}, Seconds: ${diff['_data']['seconds']}`
    };

    return (
        <div className="event-panel">
            <div className="grid-noGutter-spaceAround header col-12">
                <h2 className="col-6">Event details</h2>
                <span className="col-1" data-push-left="off-3">
                    <TooltipIcon tooltipLabel="Close" iconClassName="close-icon" tooltipPosition="left" clickHandler={closePanel}>
                        close
                    </TooltipIcon>
                </span>

            </div>
            <div className='grid-noGutter-equalHeight col-12'>
                <div className="col-6">
                    <h4 className='label'>Event ID:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{event.eventId}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>Title:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{event.title}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>Description:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{event.description}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>Start Date:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{moment(event.startDate).format('MM/DD/YYYY HH:mm:ss')}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>End Date:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{moment(event.endDate).format('MM/DD/YYYY HH:mm:ss')}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>Duration:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{calculateDurationEvent(event)}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>Status:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{getEventStatus(event)}</h4>
                </div>
                <div className="col-6">
                    <h4 className='label'>All Day Event:</h4>
                </div>
                <div className="col-6">
                    <h4 className='value'>{event.allDayEvent ? 'Yes' : 'No'}</h4>
                </div>
                <div className="col-6">
                    <h4 className="label">Location Name:</h4>
                </div>
                <div className="col-6">
                    <h4 className="value">{event.location ? event.location.locationName : "Didn't setup"}</h4>
                </div>

                <div className="grid col-12-spaceAround">
                    <div className="col grid-center">
                        <Button
                            raised
                            primary
                            disabled={moment(event.endDate).isBefore(moment(new Date()))}
                            onClick={editHandler}>Edit</Button>
                    </div>
                    <div className="col grid-center">
                        <Button flat className="md-text--theme-danger" onClick={deleteHandler}>Delete</Button>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default EventInfoPanel;
