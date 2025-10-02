import { Notification } from './notification.entity';

export type NotificationModel = Notification;

export interface NotificationRecipientParams {
  teacher: string;
  notification: string;
}
