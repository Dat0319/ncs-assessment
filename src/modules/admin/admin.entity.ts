import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppObject } from '../../common/consts';
import APP_CONFIG from '../../configs/app.config';
import { StringUtil } from '../../utils';
import { PhoneNumberProperties } from '../user/user.interface';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 50 })
  public firstName: string;

  @Column({ type: 'varchar', length: 50 })
  public lastName: string;

  @Column({ type: 'varchar', length: 100 })
  public email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  public password: string;

  @Column({
    type: 'enum',
    enum: AppObject.GENDER,
  })
  public gender: string;

  @Column({
    type: 'enum',
    enum: AppObject.ADMIN_ROLES,
    default: AppObject.ADMIN_ROLES.STAFF,
  })
  public role: string;

  @Column({
    type: 'enum',
    enum: Object.values(AppObject.USER_STATUS),
    default: AppObject.USER_STATUS.ACTIVE,
  })
  public status: string;

  @Column({ type: 'json', nullable: true })
  public mobilePhone: PhoneNumberProperties;

  @Column({ type: 'timestamp', nullable: true })
  public lastLogin: Date;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.password = StringUtil.encrypt(
      this.password,
      APP_CONFIG.ENV.SECURE.PASSWORD_SECRET_KEY
    );

    if (this.firstName) {
      this.firstName = StringUtil.titleCase(this.firstName);
    }

    if (this.lastName) {
      this.lastName = StringUtil.titleCase(this.lastName);
    }
  }

  public comparePassword(password: string): boolean {
    return (
      password ===
      StringUtil.decrypt(
        this.password,
        APP_CONFIG.ENV.SECURE.PASSWORD_SECRET_KEY
      )
    );
  }
}
