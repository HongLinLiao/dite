import { Request, Response, NextFunction } from 'express';

import { authentication as verify } from '../services/auth';
import { UnauthorizedError } from '../utils/response';

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        verify(authorization?.split(' ')[1] ?? '');
        next();
    } catch (e) {
        throw new UnauthorizedError(String(e));
    }
}
