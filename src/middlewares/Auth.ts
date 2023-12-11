import { Request, Response, NextFunction } from 'express';

import { authentication as verify } from '../services/auth';
import { UnauthorizedError } from '../utils/response';

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    getCurrentUserFromRequest(req);
    next();
}

export function getCurrentUserFromRequest(req: Request) {
    try {
        const { authorization } = req.headers;
        return verify(authorization?.split(' ')[1] ?? '');
    } catch (e) {
        throw new UnauthorizedError(String(e));
    }
}
