export class NotificationNotFoundError extends Error {
    name: string = 'NotificationNotFoundError';
    constructor(message: string) {
        super(message);
    }
}
