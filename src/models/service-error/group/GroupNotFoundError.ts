export class GroupNotFoundError extends Error {
    name: string = 'GroupNotFoundError';
    constructor(message: string) {
        super(message);
    }
}
