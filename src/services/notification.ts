import NotificationModel from '../models/mongo/Notification';
import Notification from '../models/service/Notification';
import { BadRequestError } from '../utils/response';
import { queryUserById } from './user';

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

export async function getUserNotifications(uid: string): Promise<Notification[]> {
    const user = await queryUserById(uid);
    if (!user) {
        throw new BadRequestError('User not found');
    }

    const notifySearch = await NotificationModel.find({ to: uid }).exec();
    return notifySearch.map((x) => Notification.toServiceModel(x));
}
