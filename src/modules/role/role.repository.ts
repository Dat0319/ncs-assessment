import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../libs/extensions';
import { Role } from './role.entity';

@EntityRepository(Role)
export class RoleRepository extends BaseRepository<Role> {}
