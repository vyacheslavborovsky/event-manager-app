export default class AppException extends Error {
    constructor(reason) {
        super(reason);
        this.message = reason;
    }

    getReadableErrorMessage() {
        if (this.message.indexOf('fail to fetch') !== -1) {
            return "An error occurred on the server. Probably it unavailable now.";
        }
    }
}
