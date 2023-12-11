import { Router, Request, Response } from 'express';

import { authentication as verify } from '../services/auth';
import { createGroup, deleteGroup, queryGroupById, searchGroup } from '../services/group';
import { UnauthorizedError } from '../utils/response';
import BodyValidator from '../middlewares/BodyValidator';
import { CreateGroupRequest, SearchGroupRequest } from '../models/request/group';

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

GroupRouter.post('/', BodyValidator(CreateGroupRequest), async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const jwtInfo = verify(authorization?.split(' ')[1] ?? '');

    if (!jwtInfo) {
        throw new UnauthorizedError();
    }

    const { name, description } = req.body as CreateGroupRequest;

    const group = await createGroup(
        {
            name,
            description: description ?? null,
            createTime: new Date().getTime(),
        },
        jwtInfo.uid,
    );

    if (group) {
        res.json(group);
    } else {
        throw new Error('Create group error');
    }
});

GroupRouter.delete('/:gid', async (req: Request, res: Response) => {
    // TODO: Check Authorize
    const { gid } = req.params;
    await deleteGroup(gid);
    res.sendStatus(200);
});

export default GroupRouter;
