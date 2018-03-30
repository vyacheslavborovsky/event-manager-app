import {storageServiceObj} from "../services/storageService";

export const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const withAuthHeaders = function () {
    return {
        ...defaultHeaders,
        'x-auth-token': storageServiceObj.getDataByKey('token')
    }
};
