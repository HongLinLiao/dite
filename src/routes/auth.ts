import { Router, Request, Response } from 'express';

import { getLineEndpoint, lineLogin, login, authentication as verify } from '../services/auth';
import { LoginType } from '../enums/LoginType';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { BadRequestError } from '../utils/response';

const AuthRouter = Router();

AuthRouter.post('/signIn', async (req: Request, res: Response) => {
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

AuthRouter.post('/', AuthMiddleware, async (req: Request, res: Response) => {
    // TODO: refresh token or assign new token
    res.sendStatus(200);
});

AuthRouter.get('/line/endpoint', (req: Request, res: Response) => {
    res.send(getLineEndpoint());
});

export default AuthRouter;
