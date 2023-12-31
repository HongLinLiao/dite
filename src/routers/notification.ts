import { Router, Request, Response } from 'express';

import BodyValidator from '../middlewares/BodyValidator';
import { GroupInviteRequest } from '../models/request/notification';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { inviteGroup } from '../services/group';
import { getUserNotifications } from '../services/notification';
import { GroupNotFoundError } from '../models/service-error/group/GroupNotFoundError';
import { UserNotFoundError } from '../models/service-error/user/UserNotFoundError';
import { InviteGroupError } from '../models/service-error/group/InviteGroupError';
import { BadRequestError, ForbiddenError } from '../utils/response';
import { GroupPermissionError } from '../models/service-error/group/GroupPermissionError';

export const NotificationRouter = Router();

NotificationRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    const notification = await getUserNotifications(uid);
    res.json(notification);
});

NotificationRouter.post('/group/invitation', BodyValidator(GroupInviteRequest), async (req: Request, res: Response) => {
    const { uid: from } = getCurrentUserFromRequest(req);

    const { gid, uid: to, role } = req.body as GroupInviteRequest;

    try {
        const notification = await inviteGroup(from, to, gid, role);
        res.json(notification);
    } catch (e) {
        if (e instanceof GroupNotFoundError || e instanceof UserNotFoundError || e instanceof InviteGroupError) {
            throw new BadRequestError(e.message);
        } else if (e instanceof GroupPermissionError) {
            throw new ForbiddenError(e.message);
        }
        throw e;
    }
});
