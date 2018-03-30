import React, {PureComponent} from 'react';
import {connect} from "react-redux";
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    Card, CardTitle, CardText, TabsContainer, Tab, Tabs, CardActions, Button, DialogContainer
} from 'react-md';


import eventsActions from "../actions/eventsActions";
import lineLoader from '../../assets/line-loader.svg';
import Loader from "../../common/components/Loader";
import {eventServiceObj} from "../services/eventService";
import {getMangeUIEventsData} from "../shared/eventSelector";
import {Redirect} from "react-router-dom";
import {Scrollbars} from 'react-custom-scrollbars';
import {storageServiceObj} from "../../common/services/storageService";

import '../styles/events-ui.css';
import EventInfoPanel from "../components/EventsInfoPanel";
import withRouter from "react-router-dom/es/withRouter";


class ManageUI extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            tabs: eventServiceObj.getTabsConfig(),
            columns: eventServiceObj.getEventsColumnsConfig(),
            modalState: eventServiceObj.getEmptyModalState()
        }
    }

    sortTable = (column, tab) => {
        if (column.sortable) {
            this.props.dispatch(eventsActions.setSortEvents({
                sortColumn: column.sortBy,
                dataKeyField: tab.dataKeyField
            }));
        }
    };

    componentWillMount() {
        if (storageServiceObj.hasStorageValueByKey('token')) {
            this.props.dispatch(eventsActions.setGetEventsRequesting({userId: this.props.authState.userId}));
        }
    }

    deleteMultipleEvents = () => {
        const eventIds = this.props.eventsState.manageUI.completed.map(event => event.eventId);
        this.props.dispatch(eventsActions.setDeleteMultipleEventsRequesting({
            eventIds: eventIds,
            userId: this.props.authState.userId
        }));
    };

    renderHeaderColumns = (tab) => {
        return (
            this.state.columns.map(column => {
                if (column.sortBy === this.props.eventsState.manageUI.sortColumn) {
                    return (
                        <TableColumn
                            key={column.key}
                            sorted={this.props.eventsState.manageUI.ascending}
                            role="button"
                            className={column.colClass}
                            grow={column.isGrow}
                            onClick={e => this.sortTable(column, tab)}>
                            <span className="value">{column.label}</span>
                        </TableColumn>
                    )
                }
                return (
                    <TableColumn
                        key={column.key}
                        role="button"
                        className={column.colClass}
                        grow={column.isGrow}
                        onClick={e => this.sortTable(column, tab)}>
                        <span className="value">{column.label}</span>
                    </TableColumn>
                )
            })
        )
    };

    renderRowsColumns = (item) => {
        return (
            this.state.columns.map(column => {
                return (
                    <TableColumn key={column.key} className={column.colClass}>
                        {column.getDynamicValue && <span className="value">{column.getDynamicValue(item)}</span>}
                        {!column.getDynamicValue && <span className="value">{item[column.key]}</span>}
                    </TableColumn>
                )
            })
        )
    };

    renderRows = (tab) => {
        const {selectedEvent} = this.props.eventsState;
        if (this.props.eventsState.manageUI[tab.dataKeyField].length > 0) {
            return (
                this.props.eventsState.manageUI[tab.dataKeyField].map(item => {
                    return (
                        <TableRow
                            key={item.eventId}
                            className={"grid-12 col-12" + (selectedEvent && item.eventId === selectedEvent.eventId ? ' selected' : '')}
                            onClick={e => this.setSelectedEvent(item)}
                        >
                            {this.renderRowsColumns(item)}
                        </TableRow>
                    )
                })
            )
        } else {
            return (
                <TableRow className="grid-noGutter col-12"><TableColumn className="col-12"><h1
                    className="message info-message">No data to display</h1></TableColumn></TableRow>
            )
        }
    };

    renderTabs = () => {
        return (
            this.state.tabs.map(tab => {
                return (
                    <Tab
                        label={tab.label}
                        key={tab.key}>
                        <DataTable
                            className="grid-12 col-12"
                            plain>
                            <TableHeader className="grid-12 col-12">
                                <TableRow className="grid-12 col-12-center">
                                    {this.renderHeaderColumns(tab)}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="grid-12 col-12-center">
                                <Scrollbars
                                    autoHeight
                                    autoHeightMin={0}
                                    autoHeightMax={500}>
                                    {this.renderRows(tab)}
                                </Scrollbars>
                            </TableBody>
                        </DataTable>
                    </Tab>
                )
            })
        )
    };

    showDeleteConfirmationDialog = () => {
        const dialogConfig = eventServiceObj.getDeleteConfirmationModalConfig(this.deleteEvent, this.closeDialog);
        this.setState({
            modalState: dialogConfig,
        });
    };

    deleteEvent = () => {
        this.props.dispatch(eventsActions.setDeleteEventRequesting({
            eventId: this.props.eventsState.selectedEvent.eventId,
            userId: this.props.userId
        }));

        this.props.dispatch(eventsActions.setSelectedEvent(null));
        this.closeDialog();
    };

    closeDialog = () => {
        this.setState({
            modalState: eventServiceObj.getEmptyModalState()
        })
    };

    setSelectedEvent = (event) => {
        const {selectedEvent} = this.props.eventsState;
        if (selectedEvent && selectedEvent.eventId === event.eventId) {

        } else {
            this.props.dispatch(eventsActions.setSelectedEvent(event));
        }
    };

    render() {
        const {isEventRequestPending, selectedEvent} = this.props.eventsState;
        const {completed} = this.props.eventsState.manageUI;
        const {modalState} = this.state;
        const {from} = this.props.location.state || {from: {pathname: '/login'}};

        if (!this.props.authState.isLoginSuccess) {
            return (
                <Redirect to={from}/>
            )
        }

        if (isEventRequestPending !== false) {
            return (
                <Loader loaderSrc={lineLoader} size="250px" loadingText="Loading events..."/>
            )
        }

        if (isEventRequestPending === false) {
            return (
                <Card className="grid-noGutter-center-middle events-ui md-paper--5">
                    <CardTitle
                        title="Manage UI"
                        className="grid-6-center col-12"
                    />
                    {completed && completed.length > 0 &&
                    <CardActions className="grid-noGutter-column-center col">
                        <Button className="col-5-center" raised secondary onClick={this.deleteMultipleEvents}>Remove
                            Completed</Button>
                    </CardActions>
                    }
                    <CardText className="grid-noGutter-center-middle ui-container">
                        <TabsContainer
                            panelClassName={"grid-12-noGutter col-12" + (isEventRequestPending ? ' hidden-item' : '')}
                            colored>
                            <Tabs tabId="events-ui">
                                {this.renderTabs()}
                            </Tabs>
                        </TabsContainer>

                        {selectedEvent &&
                        <EventInfoPanel
                            event={selectedEvent}
                            deleteHandler={this.showDeleteConfirmationDialog}
                            editHandler={e => eventServiceObj.goToEditView(this.props.history, selectedEvent.eventId)}
                            closePanel={e => eventServiceObj.closeInfoPanel(this.props.dispatch)}
                        />}

                        <DialogContainer
                            id="modal"
                            visible={modalState.isOpen}
                            onHide={this.closeDialog}
                            actions={modalState.actions}
                            title={modalState.title}
                            titleClassName={modalState.titleClassName}>
                            {modalState.content}
                        </DialogContainer>
                    </CardText>
                </Card>
            )
        }

    }
}

const mapStateToProps = () => (state, ownProps) => {
    return getMangeUIEventsData(state.eventsState, state.authState)(state, ownProps)
};

export default connect(mapStateToProps)(withRouter(ManageUI));
