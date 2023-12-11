import { ConfirmStatus } from '../../enums/ConfirmStatus';
import { NotificationLevel } from '../../enums/NotificationLevel';
import { NotificationType } from '../../enums/NotificationType';

export default interface INotification {
    id: string;
    type: NotificationType;
    from: string;
    fromLevel: NotificationLevel;
    to: string;
    status: ConfirmStatus;
    target: string;
    touched: boolean;
    createTime: number;
}
