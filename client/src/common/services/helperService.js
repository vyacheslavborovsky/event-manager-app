import withQuery from 'with-query';
import {httpServiceObj} from "./httpService";
import {withAuthHeaders} from "../constants/defaultHeaders";

export const helperServiceObj = {

    prepareDatesForEditing(types, input) {
        for (let type of types) {
            const dateField = type + 'Date';
            let dateString = `${input[dateField].getMonth() + 1}/${input[dateField].getDate()}/${input[dateField].getFullYear()}`;
            let timeString = `${input[dateField].getHours()}:${input[dateField].getMinutes()}`;

            input[dateField] = dateString;
            input[type + 'Time'] = timeString;
        }

        return input;
    },

    prepareLocationName(input) {
        if (input.location && input.location.locationName) {
            input['locationName'] = input.location.locationName;
        }
        return input;
    },

    prepareEventDatesForSave(dateProp, timeProp, values) {
        const [month, day, year] = values[dateProp].split('/');
        let result = null;

        if (values[timeProp] instanceof Date) {
            const [hours, minutes, seconds, milliseconds] = [values[timeProp].getHours(), values[timeProp].getMinutes(), values[timeProp].getSeconds(), values[timeProp].getMilliseconds()];
            result = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, Number.parseInt(day, 10), hours, minutes, seconds, milliseconds)
        } else {
            const [hours, minutes, seconds, milliseconds] = values[timeProp].split(':').concat(['00', '000']);
            result = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, Number.parseInt(day, 10), Number.parseInt(hours, 10), Number.parseInt(minutes, 10), Number.parseInt(seconds, 10), Number.parseInt(milliseconds, 10))
        }

        return result;
    },

    getUrlWithQueryParams(url, params) {
        return withQuery(url, params)
    },

    getUsersActivityData() {
        const data = {
            method: "GET",
            headers: withAuthHeaders()
        };

        return httpServiceObj.httpRequest('/common/activity', data);
    }
};
