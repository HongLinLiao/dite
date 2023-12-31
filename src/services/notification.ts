import { ConfirmStatus } from '../enums/ConfirmStatus';
import { NotificationType } from '../enums/NotificationType';
import NotificationModel from '../models/mongo/Notification';
import { NotificationNotFoundError, UpdateNotificationError, UserNotFoundError } from '../models/service-error';
import Notification from '../models/service/Notification';
import { confirmGroupInvitation } from './group';
import { queryUserById } from './user';

export async function getUserNotifications(uid: string): Promise<Notification[]> {
    const user = await queryUserById(uid);
    if (!user) {
        throw new UserNotFoundError('User not found');
    }

    const notifySearch = await NotificationModel.find({ to: uid }).exec();
    return notifySearch.map((x) => Notification.toServiceModel(x));
}

export async function queryNotification(nid: string): Promise<Notification | null> {
    const search = await NotificationModel.findById(nid).exec();
    return search && Notification.toServiceModel(search);
}

export async function createNotification(notification: Notification) {
    const notify = await new NotificationModel({
        type: notification.type,
        from: notification.from,
        fromLevel: notification.fromLevel,
        to: notification.to,
        status: notification.status,
        target: notification.target,
        touched: notification.touched,
        createTime: notification.createTime,
    }).save();

    return Notification.toServiceModel(notify);
}

export async function updateNotification(nid: string, uid: string, confirmStatus?: ConfirmStatus): Promise<Notification> {
    const notification = await queryNotification(nid);

    if (!notification) {
        throw new NotificationNotFoundError('Notification not found');
    }

    switch (notification.type) {
        case NotificationType.GroupInvite: {
            return await confirmGroupInvitation(nid, uid, confirmStatus);
        }
        default: {
            throw new UpdateNotificationError(`Invalid notification type`);
        }
    }
}
