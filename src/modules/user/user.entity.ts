import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppObject } from '../../common/consts';
import APP_CONFIG from '../../configs/app.config';
import { StringUtil } from '../../utils';
import { Role } from '../role/role.entity';
import { UserRole } from './entities/user-role.entity';
import { PhoneNumberProperties } from './user.interface';

@Entity()
@Index(AppObject.INDEX_DB.UNIQUE_EMAIL, ['email'], {
  unique: true,
  where: `"isDeleted" IS FALSE AND "facebookId" IS NULL AND "googleId" IS NULL`,
})
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 50 })
  public firstName: string;

  @Column({ type: 'varchar', length: 50 })
  public lastName: string;

  @Column({ type: 'text', nullable: true })
  public dateOfBirth: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public gender: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public email: string;

  @Column({ type: 'json', nullable: true })
  public mobilePhone: PhoneNumberProperties;

  @Column({
    type: 'enum',
    enum: Object.values(AppObject.USER_STATUS),
    default: AppObject.USER_STATUS.UNVERIFIED,
  })
  public status: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean; // is suspend, if we need update status above

  @Column({
    type: 'enum',
    enum: Object.values(AppObject.USER_TYPE),
    default: AppObject.USER_TYPE.STUDENT,
  })
  public type: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public facebookId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public googleId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public password: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public lastLogin: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.password = StringUtil.encrypt(
      this.password,
      APP_CONFIG.ENV.SECURE.PASSWORD_SECRET_KEY
    );
    this.firstName = StringUtil.titleCase(this.firstName);
    this.lastName = StringUtil.titleCase(this.lastName);
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

  // Relationship Section
  @ManyToMany(() => Role, (roles) => roles.user)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  public roles: Role[];

  @OneToMany(() => Role, (userRoles) => userRoles.user)
  public userRoles: UserRole[];

  @ManyToMany(() => User, (user) => user.teachers)
  @JoinTable({
    name: 'user_register_teacher',
    joinColumn: {
      name: 'teacherId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'studentId',
      referencedColumnName: 'id',
    },
  })
  students: User[];

  @ManyToMany(() => User, (user) => user.students)
  @JoinTable({
    name: 'user_register_teacher',
    joinColumn: { name: 'teacherId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  public teachers: User[];
}
