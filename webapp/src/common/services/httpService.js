import * as fetch from 'isomorphic-fetch';
import appConfig from "../constants/config";

export const httpServiceObj = {

    handleResponse(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    },

    httpRequest(url, data) {
        return fetch(`${appConfig.mode === 'production' ? '/api/v1' : ''}${url}`, data)
            .then(this.handleResponse)
            .then(response => response.json())
            .catch(error => {
                throw error
            })
    }
};
