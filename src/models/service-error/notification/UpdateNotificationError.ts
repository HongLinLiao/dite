export class UpdateNotificationError extends Error {
    name: string = 'UpdateNotificationError';
    constructor(message: string) {
        super(message);
    }
}
