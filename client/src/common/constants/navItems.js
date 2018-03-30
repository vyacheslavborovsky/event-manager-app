import Login from "../../users/containers/Login";
import Register from "../../users/containers/Register";
import EventsGrid from "../../events/containers/EventsGrid";
import Event from "../../events/containers/Event";
import ManageUI from "../../events/containers/ManageUI";
import ActivityDashboard from "../containers/ActivityDashboard";

const TO_PREFIX = '/events';

export const navItems = [
    {
        label: 'Create Event',
        to: `${TO_PREFIX}/new`,
        path: `${TO_PREFIX}/:eventId`,
        icon: 'note_add',
        isPrivate: true,
        component: Event
    }, {
        label: 'Calendar',
        to: `${TO_PREFIX}-calendar`,
        path: `${TO_PREFIX}-calendar`,
        icon: 'grid_on',
        isPrivate: true,
        component: EventsGrid
    }, {
        label: 'Manage events',
        to: `${TO_PREFIX}-manage`,
        path: `${TO_PREFIX}-manage`,
        icon: 'airplay',
        isPrivate: true,
        component: ManageUI
    }, {
        label: 'View activity',
        to: `${TO_PREFIX}-activity`,
        path: `${TO_PREFIX}-activity`,
        icon: 'local_activity',
        isPrivate: true,
        component: ActivityDashboard
    }];


export const toolbarItems = [{
    label: 'Log In',
    to: '/login',
    path: '/login',
    icon: 'perm_identity',
    isPrivate: false,
    isShow: (state) => state.sessionUser === null,
    component: Login
}, {
    label: 'Sign Up',
    to: '/signup',
    path: '/signup',
    icon: 'swap_horiz',
    isPrivate: false,
    isShow: (state) => state.sessionUser === null && state.isLoginSuccess !== true,
    component: Register
}, {
    label: 'Log out',
    to: '/logout',
    path: '/logout',
    icon: 'pan_tool',
    isPrivate: true,
    component: Login,
    isShow: (state) => state.sessionUser !== null,
    action: 'logout'
}
];
