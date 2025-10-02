import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../libs/extensions';
import { Admin } from './admin.entity';

@EntityRepository(Admin)
export class AdminRepository extends BaseRepository<Admin> {}
