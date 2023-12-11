import { Router, Request, Response } from 'express';

import BodyValidator from '../middlewares/BodyValidator';
import { GroupInviteRequest } from '../models/request/notify';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { inviteGroup } from '../services/group';
import { getUserNotifications } from '../services/notification';

const NotifyRouter = Router();

NotifyRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);

    const notification = await getUserNotifications(uid);
    res.json(notification);
});

NotifyRouter.post('/group/invite', BodyValidator(GroupInviteRequest), async (req: Request, res: Response) => {
    const jwtInfo = getCurrentUserFromRequest(req);

    const { gid, uid, role } = req.body as GroupInviteRequest;
    const notification = await inviteGroup(jwtInfo.uid, uid, gid, role);
    res.json(notification);
});

export default NotifyRouter;
