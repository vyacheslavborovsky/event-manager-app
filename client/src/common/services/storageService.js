export const storageServiceObj = {

    getDataByKey(key) {
        let data = localStorage.getItem(key);
        return JSON.parse(data);
    },

    saveDataByName(key, data) {
        if (data !== null) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    },

    removeItem(key) {
        if (this.hasStorageValueByKey(key)) {
            localStorage.removeItem(key);
            return true;
        }

        return false;
    },

    hasStorageValueByKey(key) {
        return !!localStorage.getItem(key);
    }
};
