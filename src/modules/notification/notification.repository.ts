import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../libs/extensions';
import { Notification } from './notification.entity';

@EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {}
