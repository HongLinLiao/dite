export class GroupUpdateError extends Error {
    name: string = 'GroupUpdateError';
    constructor(message: string) {
        super(message);
    }
}
