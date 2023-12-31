export class NotificationPermissionError extends Error {
    name: string = 'NotificationPermissionError';
    constructor(message: string) {
        super(message);
    }
}
