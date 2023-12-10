import { Router, Request, Response } from 'express';

import { createLung, queryLungByUid } from '../services/lung';
import { CreateLungRequest } from '../models/request/lung';
import BodyValidator from '../middlewares/BodyValidator';

const LungRouter = Router();

LungRouter.post('/', BodyValidator(CreateLungRequest), async (req: Request, res: Response) => {
    const { uid, year, month, day, standardQuantity, packingQuantity } = req.body;
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
});

LungRouter.get('/:uid', async (req: Request, res: Response) => {
    const { uid } = req.params;
    const data = await queryLungByUid(uid);
    res.json(data);
});

export default LungRouter;
