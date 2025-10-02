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
@Index(AppObject.INDEX_DB.UNIQUE_USER_ROLE, ['userId', 'roleId'], {
  unique: true,
})
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userId: string;
  @Column()
  public roleId: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public updatedBy: Date;

  // Relationship Section
  @ManyToOne(() => User, (user) => user.roles)
  public user: User[];
}

@EntityRepository(UserRole)
export class UserRoleRepository extends BaseRepository<UserRole> {}
