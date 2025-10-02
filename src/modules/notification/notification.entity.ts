import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'text' })
  public content: string;

  @Column({ type: 'varchar', length: 10000 })
  public emails: string;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  public updatedBy: string;
}
