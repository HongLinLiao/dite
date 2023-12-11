import { Router, Request, Response } from 'express';

import { createGroup, deleteGroup, queryGroupById, queryGroupByUid, searchGroup } from '../services/group';
import BodyValidator from '../middlewares/BodyValidator';
import { CreateGroupRequest, SearchGroupRequest } from '../models/request/group';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { InternalServerError } from '../utils/response';

const GroupRouter = Router();

GroupRouter.get('/search', BodyValidator(SearchGroupRequest), async (req: Request, res: Response) => {
    const { keyword } = req.body as SearchGroupRequest;
    const groups = await searchGroup(keyword, { withMember: true });
    res.json(groups);
});

GroupRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    res.json(await queryGroupByUid(uid));
});

GroupRouter.get('/:gid', async (req: Request, res: Response) => {
    const { gid } = req.params;
    res.json(await queryGroupById(gid));
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

    if (group) {
        res.json(group);
    } else {
        throw new InternalServerError('Create group error');
    }
});

GroupRouter.delete('/:gid', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const { gid } = req.params;
    await deleteGroup(uid, gid);
    res.sendStatus(200);
});

export default GroupRouter;
