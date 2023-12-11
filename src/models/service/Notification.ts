import { ConfirmStatus } from '../../enums/ConfirmStatus';
import { NotificationLevel } from '../../enums/NotificationLevel';
import { NotificationType } from '../../enums/NotificationType';
import INotification from '../data/Notification';

export default class Notification {
    id?: string;
    type: NotificationType;
    from: string;
    fromLevel: NotificationLevel;
    to: string;
    status: ConfirmStatus;
    target: string;
    touched: boolean;
    createTime: number;

    static toServiceModel(data: INotification): Notification {
        return {
            id: data.id,
            type: data.type,
            from: data.from,
            fromLevel: data.fromLevel,
            to: data.to,
            status: data.status,
            target: data.target,
            touched: data.touched,
            createTime: data.createTime,
        };
    }
}
