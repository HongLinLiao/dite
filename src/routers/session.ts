import { Router, Request, Response } from 'express';

import { getLineEndpoint, lineLogin, login } from '../services/session';
import { LoginType } from '../enums/LoginType';
import AuthMiddleware from '../middlewares/Auth';
import { BadRequestError } from '../utils/response';
import { SignInRequest } from '../models/request/session';
import BodyValidator from '../middlewares/BodyValidator';

export const SessionRouter = Router();

SessionRouter.post('/new', BodyValidator(SignInRequest), async (req: Request, res: Response) => {
    const { code, loginType } = req.body;

    switch (loginType) {
        case LoginType.LINE: {
            const jwtInfo = await lineLogin(code);
            const jwt = await login(jwtInfo);
            res.send(jwt);
            break;
        }
        default: {
            throw new BadRequestError('Invalid login agent');
        }
    }
});

SessionRouter.post('/', AuthMiddleware, async (req: Request, res: Response) => {
    // TODO: refresh token or assign new token
    res.sendStatus(200);
});

SessionRouter.get('/endpoint/line', (req: Request, res: Response) => {
    res.send(getLineEndpoint());
});
