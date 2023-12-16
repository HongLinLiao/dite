import { Router, Request, Response } from 'express';

import { createLung, queryLungByUid } from '../services/lung';
import { CreateLungRequest } from '../models/request/lung';
import BodyValidator from '../middlewares/BodyValidator';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { UserNotFoundError } from '../models/service-error/user/UserNotFoundError';
import { BadRequestError } from '../utils/response';

const LungRouter = Router();

LungRouter.post('/', BodyValidator(CreateLungRequest), async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const { year, month, day, standardQuantity, packingQuantity } = req.body as CreateLungRequest;
    try {
        const data = await createLung({
            uid,
            year,
            month,
            day,
            standardQuantity: standardQuantity ?? null,
            packingQuantity: packingQuantity ?? null,
            createTime: new Date().getTime(),
        });
        res.json(data);
    } catch (e) {
        if (e instanceof UserNotFoundError) {
            throw new BadRequestError(e.message);
        }
        throw e;
    }
});

LungRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    res.json(await queryLungByUid(uid));
});

export default LungRouter;
