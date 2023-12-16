export class InviteGroupError extends Error {
    name: string = 'InviteGroupError';
    constructor(message: string) {
        super(message);
    }
}
