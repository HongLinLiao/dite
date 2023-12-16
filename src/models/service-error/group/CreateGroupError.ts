export class CreateGroupError extends Error {
    name: string = 'CreateGroupError';
    constructor(message: string) {
        super(message);
    }
}
