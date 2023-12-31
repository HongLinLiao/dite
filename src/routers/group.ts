import { Router, Request, Response } from 'express';

import { createGroup, deleteGroup, queryGroupById, queryGroupByUid, searchGroup } from '../services/group';
import BodyValidator from '../middlewares/BodyValidator';
import { CreateGroupRequest } from '../models/request/group';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { GroupPermissionError } from '../models/service-error/group/GroupPermissionError';
import { ForbiddenError } from '../utils/response';

export const GroupRouter = Router();

GroupRouter.get('/search', async (req: Request, res: Response) => {
    const keyword = req.query.keyword as string;

    if (!keyword) {
        return res.json([]);
    }

    const groups = await searchGroup(keyword);
    res.json(groups);
});

GroupRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    const withMember = (req.query.member as string)?.isTruthy();

    res.json(await queryGroupByUid(uid, { withMember }));
});

GroupRouter.get('/:gid', async (req: Request, res: Response) => {
    const { gid } = req.params;
    const withMember = (req.query.member as string)?.isTruthy();

    res.json(await queryGroupById(gid, { withMember }));
});

GroupRouter.post('/', BodyValidator(CreateGroupRequest), async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const { name, description } = req.body as CreateGroupRequest;

    const group = await createGroup(
        {
            name,
            description: description ?? null,
            createTime: new Date().getTime(),
        },
        uid,
    );

    res.json(group);
});

GroupRouter.delete('/:gid', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const { gid } = req.params;

    try {
        await deleteGroup(uid, gid);
    } catch (e) {
        if (e instanceof GroupPermissionError) {
            throw new ForbiddenError(e.message);
        }
        throw e;
    }

    res.sendStatus(200);
});
