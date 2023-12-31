import { Router, Request, Response } from 'express';

import BodyValidator from '../middlewares/BodyValidator';
import { GroupInviteRequest, NotificationUpdateRequest } from '../models/request/notification';
import { getCurrentUserFromRequest } from '../middlewares/Auth';
import { inviteGroup } from '../services/group';
import { getUserNotifications, updateNotification } from '../services/notification';
import { GroupNotFoundError } from '../models/service-error/group/GroupNotFoundError';
import { UserNotFoundError } from '../models/service-error/user/UserNotFoundError';
import { InviteGroupError } from '../models/service-error/group/InviteGroupError';
import { BadRequestError, ForbiddenError } from '../utils/response';
import { GroupPermissionError } from '../models/service-error/group/GroupPermissionError';
import { NotificationPermissionError } from '../models/service-error/notification/NotificationPermissionError';
import { NotificationNotFoundError } from '../models/service-error/notification/NotificationNotFoundError';
import { UpdateNotificationError } from '../models/service-error/notification/UpdateNotificationError';

export const NotificationRouter = Router();

NotificationRouter.get('/', async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    const notification = await getUserNotifications(uid);
    res.json(notification);
});

NotificationRouter.patch('/:nid', BodyValidator(NotificationUpdateRequest), async (req: Request, res: Response) => {
    const { uid } = getCurrentUserFromRequest(req);
    const { confirmStatus } = req.body as NotificationUpdateRequest;
    const { nid } = req.params;

    try {
        const result = await updateNotification(nid, uid, confirmStatus);
        return res.json(result);
    } catch (e) {
        if (e instanceof NotificationNotFoundError || e instanceof UpdateNotificationError) {
            throw new BadRequestError(e.message);
        } else if (e instanceof NotificationPermissionError) {
            throw new ForbiddenError(e.message);
        }
        throw e;
    }
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
