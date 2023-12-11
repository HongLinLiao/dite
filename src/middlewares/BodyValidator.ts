import { Request, Response, NextFunction } from 'express';
import { ClassConstructor } from 'class-transformer';
import { asyncMiddleware } from 'middleware-async';

import { validBody } from '../utils/class-validator';
import { BadRequestError } from '../utils/response';

export default function BodyValidator(type: ClassConstructor<object>) {
    return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.body) {
            throw new BadRequestError(`Body is required`);
        }

        await validBody(type, req);
        next();
    });
}
