export class GroupPermissionError extends Error {
    name: string = 'GroupPermissionError';
    constructor(message: string) {
        super(message);
    }
}
