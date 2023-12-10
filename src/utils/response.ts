export type ResponseError = {
    name: string;
    status: number;
    message: string;
};

export class BadRequestError extends Error implements ResponseError {
    public name: string = 'BadRequestError';
    public status: number = 400;

    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error implements ResponseError {
    public name: string = 'UnauthorizedError';
    public status: number = 401;

    constructor(message: string = 'Unauthorized') {
        super(message);
    }
}
