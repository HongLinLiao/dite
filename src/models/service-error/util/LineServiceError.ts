export class LineServiceError extends Error {
    name: string = 'LineServiceError';
    constructor(message: string) {
        super(message);
    }
}
