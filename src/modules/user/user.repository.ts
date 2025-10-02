import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../libs/extensions';
import { User } from './user.entity';
import { UserModel } from './user.interface';

@EntityRepository(User)
export class UserRepository extends BaseRepository<UserModel> {}
