import { Schema, model } from 'mongoose';

import INotification from '../data/Notification';
import { addIdField } from '../../utils/mongo';
import { NotificationType } from '../../enums/NotificationType';
import { NotificationLevel } from '../../enums/NotificationLevel';
import { ConfirmStatus } from '../../enums/ConfirmStatus';

export const NotificationSchema = new Schema<INotification>({
    type: {
        type: Number,
        enum: NotificationType,
        default: NotificationType.GroupInvite,
        required: true,
    },
    from: { type: String, required: true },
    fromLevel: {
        type: Number,
        enum: NotificationLevel,
        default: NotificationLevel.User,
        required: true,
    },
    to: { type: String, required: true },
    status: {
        type: Number,
        enum: ConfirmStatus,
        default: ConfirmStatus.None,
        required: true,
    },
    target: { type: String, required: true },
    touched: { type: Boolean, required: true, default: false },
    createTime: { type: Number, required: true },
});

addIdField(NotificationSchema);

const NotificationModel = model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
