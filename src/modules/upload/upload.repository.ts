import { EntityRepository } from 'typeorm';
import { BaseRepository } from '../../libs/extensions';
import { Upload } from './upload.entity';

@EntityRepository(Upload)
export class UploadRepository extends BaseRepository<Upload> {}
