/**
 * Notification Service
 * @module Notification Controller
 * @description Config controller
 */

import { getCustomRepository } from 'typeorm';

import { AppObject } from '../../common/consts';
import { UserModel } from '../user/user.interface';
import { UserRepository } from '../user/user.repository';
import { NotificationRecipientParams } from './notification.model';
import { NotificationRepository } from './notification.repository';

export class NotificationService {
  private static instance: NotificationService;
  private notificationRepository: NotificationRepository;
  private userRepository: UserRepository;

  constructor() {
    if (NotificationService.instance) {
      return NotificationService.instance;
    }

    this.notificationRepository = getCustomRepository(NotificationRepository);
    this.userRepository = getCustomRepository(UserRepository);
    NotificationService.instance = this;
  }

  /**
   * @method create
   * @description Create new notification
   */
  async create() {
    return;
  }

  /**
   * @method list
   * @description Get list
   */
  async list() {
    return;
  }

  /**
   * @async
   * @method getById
   * @description Get detail by id
   * @param params {id}
   */
  async getById() {
    return;
  }

  /**
   * @async
   * @method updateById
   * @description Update by id
   * @param params {id}
   */
  async updateById() {
    return;
  }

  /**
   * @async
   * @method deleteById
   * @description Delete by id
   * @param params {id}
   */
  async deleteById() {
    return;
  }

  /**
   * @async
   * @method recipients
   * @description Get recipients
   * @param params {id}
   */
  /**
   * @async
   * @method recipients
   * @description Get recipients for notification
   * @param body { teacher: string; notification: string }
   */
  async recipients(user: UserModel, body: NotificationRecipientParams) {
    const { teacher, notification } = body;

    if (user?.type != AppObject.USER_TYPE.TEACHER) {
      throw new Error(`${user?.email} is not a teacher!`);
    }

    const teacherUser = await this.userRepository.findOne({
      where: {
        email: teacher,
        isDeleted: false,
        type: AppObject.USER_TYPE.TEACHER,
      },
      relations: ['students'],
    });

    if (!teacherUser) {
      throw new Error(`Teacher with email ${teacher} not found`);
    }

    const registeredStudents =
      teacherUser.students?.filter((s) => !s.isDeleted).map((s) => s.email) ||
      [];

    const mentionRegex = /@([\w.+-]+@[\w-]+\.[\w.-]+)/g;
    const mentionedStudents: string[] = [];
    let match;
    while ((match = mentionRegex.exec(notification)) !== null) {
      mentionedStudents.push(match[1]);
    }

    const recipients = Array.from(
      new Set([...registeredStudents, ...mentionedStudents])
    );

    this.notificationRepository.createDoc({
      title: 'Notification sent to students of ' + teacher,
      content: notification,
      emails: recipients.join(', '),
      createdBy: user?.email,
      updatedBy: user?.email,
    });

    return { recipients };
  }
}
