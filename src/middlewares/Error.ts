import { Request, Response, NextFunction } from 'express';

import { ResponseError, BadRequestError, UnauthorizedError, ForbiddenError, InternalServerError } from '../utils/response';

export default function ErrorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    let response: ResponseError;

    if (err instanceof BadRequestError || err instanceof UnauthorizedError || err instanceof ForbiddenError || err instanceof InternalServerError) {
        response = {
            name: err.name,
            status: err.status,
            message: err.message,
        };
    } else {
        response = {
            name: err.name,
            status: 500,
            message: err.message,
        };
    }

    res.status(response.status).json(response);
}
