import { Router, Request, Response } from 'express';

import { createGroup, deleteGroup, queryGroupById, queryGroupByUid, searchGroup } from '../services/group';
import BodyValidator from '../middlewares/BodyValidator';
import { CreateGroupRequest, SearchGroupRequest } from '../models/request/group';
import { getCurrentUserFromRequest } from '../middlewares/Auth';

const GroupRouter = Router();

GroupRouter.get('/search', BodyValidator(SearchGroupRequest), async (req: Request, res: Response) => {
    const { keyword } = req.body as SearchGroupRequest;
    // TODO: query string
    const groups = await searchGroup(keyword, { withMember: true });
    res.json(groups);
});

GroupRouter.get('/my', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    // TODO: query string
    res.json(await queryGroupByUid(uid, { withMember: true }));
});

GroupRouter.get('/:gid', async (req: Request, res: Response) => {
    const { gid } = req.params;
    // TODO: query string
    res.json(await queryGroupById(gid, { withMember: true }));
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
    await deleteGroup(uid, gid);
    res.sendStatus(200);
});

export default GroupRouter;
