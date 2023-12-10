import { Request, Response, NextFunction } from 'express';
import { ClassConstructor } from 'class-transformer';
import { asyncMiddleware } from 'middleware-async';

import { validBody } from '../utils/class-validator';

export default function BodyValidator(type: ClassConstructor<object>) {
    return asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
        await validBody(type, req);
        next();
    });
}
