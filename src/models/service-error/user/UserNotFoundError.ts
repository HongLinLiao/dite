export class UserNotFoundError extends Error {
    name: string = 'UserNotFoundError';
    constructor(message: string) {
        super(message);
    }
}
