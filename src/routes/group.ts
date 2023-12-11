import { Router, Request, Response } from 'express';

import { createGroup, deleteGroup, inviteGroup, queryGroupById, searchGroup } from '../services/group';
import BodyValidator from '../middlewares/BodyValidator';
import { CreateGroupRequest, GroupInviteRequest, SearchGroupRequest } from '../models/request/group';
import { getCurrentUserFromRequest } from '../middlewares/Auth';

const GroupRouter = Router();

GroupRouter.get('/search', BodyValidator(SearchGroupRequest), async (req: Request, res: Response) => {
    const { keyword } = req.body as SearchGroupRequest;
    const groups = await searchGroup(keyword, { withMember: true });
    res.json(groups);
});

GroupRouter.get('/:gid', async (req: Request, res: Response) => {
    const { gid } = req.params;
    res.json(await queryGroupById(gid));
});

GroupRouter.post('/invite', BodyValidator(GroupInviteRequest), async (req: Request, res: Response) => {
    const jwtInfo = getCurrentUserFromRequest(req);

    const { gid, uid, role } = req.body as GroupInviteRequest;
    const notification = await inviteGroup(jwtInfo.uid, uid, gid, role);
    res.json(notification);
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
        throw new Error('Create group error');
    }
});

GroupRouter.delete('/:gid', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const { gid } = req.params;
    await deleteGroup(uid, gid);
    res.sendStatus(200);
});

export default GroupRouter;
