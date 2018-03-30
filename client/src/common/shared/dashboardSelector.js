import {createSelector} from 'reselect';

export const getActivityData = state => state.commonState.usersActivity;
export const getRequestFlag = state => state.commonState.commonRequestPending;
export const getSessionUser = state => state.authState.sessionUser;


export const getDashboardData = () => createSelector(
    [getActivityData, getRequestFlag, getSessionUser],
    (activityData, commonRequestPending, user) => {
        const pageData = {
            activityData: activityData,
            commonRequestPending: commonRequestPending
        };

        if (activityData && activityData.length > 0) {
            const sessionUserActivity = activityData.filter(item => item._id === user._id);

            if (sessionUserActivity && sessionUserActivity[0]) {
                pageData['rateData'] = [
                    {name: 'Completed events', value: sessionUserActivity[0]['completed']},
                    {name: 'Events in progress', value: sessionUserActivity[0]['progress']},
                    {name: 'Upcoming events', value: sessionUserActivity[0]['upcoming']}
                ];
            }
        }

        return pageData;
    }
);
