import {
  Column,
  CreateDateColumn,
  Entity,
  EntityRepository,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppObject } from '../../../common/consts';
import { BaseRepository } from '../../../libs/extensions';
import { User } from '../user.entity';

@Entity()
@Index(AppObject.INDEX_DB.UNIQUE_USER_ROLE, ['studentId', 'teacherId'], {
  unique: true,
})
export class UserRegisterTeacher {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public studentId: string;
  @Column()
  public teacherId: string;

  @Column({ type: 'boolean', default: false })
  public isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public updatedBy: string;

  // Relationship Section
  @ManyToOne(() => User, (user) => user.roles)
  public user: User[];
}

@EntityRepository(UserRegisterTeacher)
export class UserRegisterTeacherRepository extends BaseRepository<UserRegisterTeacher> {}
