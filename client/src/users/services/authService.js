import {defaultHeaders, withAuthHeaders} from "../../common/constants/defaultHeaders";
import {httpServiceObj} from "../../common/services/httpService";

export const authServiceObj = {
    register(body) {
        const data = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        };

        return httpServiceObj.httpRequest( '/auth/register/local', data);
    },

    login(body) {

        const data = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        };

        return httpServiceObj.httpRequest( '/auth/login/local', data);
    },

    getCurrentUser() {
        const data = {
            method: "GET",
            headers: withAuthHeaders(),
        };

        return httpServiceObj.httpRequest( '/auth/me', data);
    }
};
