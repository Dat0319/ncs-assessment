// import { Document, Model } from 'mongoose';
import { DeepPartial, ObjectLiteral, Repository } from 'typeorm';
import { AppConst } from '../../common/consts';
import {
  ParamsCommonGetDetail,
  ParamsCommonList,
  ParamsUpdateCommonList,
} from '../../common/interfaces';

// export class MongooseRepository<TModel extends Document> {
//   public TSchema: Model<TModel>;

//   constructor(schema: Model<TModel>) {
//     this.TSchema = schema;
//   }

//   async create(params: TModel): Promise<TModel> {
//     return this.TSchema.create(params);
//   }

//   async findOne(params): Promise<TModel> {
//     return this.TSchema.findOne(params.conditions).projection(
//       params.projections
//     );
//   }

//   async detailByConditions(params): Promise<TModel> {
//     return this.TSchema.findOne(params.conditions).projection(
//       params.projections
//     );
//   }

//   async list(params): Promise<TModel[]> {
//     return this.TSchema.find(params.conditions).projection(params.projection);
//   }

//   async listAll(params): Promise<TModel[]> {
//     return this.TSchema.find(params.conditions).projection(params.projection);
//   }

//   async updateMany(params): Promise<any> {
//     return this.TSchema.updateMany(params.conditions, params.data);
//   }

//   async deleteMany(params): Promise<any> {
//     return this.TSchema.deleteMany(params.conditions);
//   }

//   async countByConditions(conditions) {
//     return this.TSchema.countDocuments(conditions);
//   }
// }

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  async detailByConditions(params: ParamsCommonGetDetail<T>): Promise<T> {
    if (params.overwriteConditions) {
      Object.assign(params.conditions, params.overwriteConditions);
    } else {
      Object.assign(params.conditions, { isDeleted: false });
    }

    return this.findOne({
      where: params.conditions,
      select: (params.select as (keyof T)[]) ?? null,
    }) as Promise<T>;
  }

  async updateByConditions(params: ParamsUpdateCommonList<T>) {
    if (params.overwriteConditions) {
      Object.assign(params.conditions, params.overwriteConditions);
    } else {
      Object.assign(params.conditions, { isDeleted: false });
    }

    return (
      this.createQueryBuilder()
        // .update(params.data)
        .update()
        .set(params.data)
        .where(params.conditions)
        // .returning('*')
        .execute()
    );
  }

  async createDoc(params: DeepPartial<T>) {
    return this.save(this.create(params) as DeepPartial<T>);
  }

  async list(params: ParamsCommonList<T>) {
    const PAGE = +params.paginate.page || AppConst.PAGE;
    const PAGE_SIZE = +params.paginate.pageSize || AppConst.PAGE_SIZE;

    params.conditions.andWhere(`(${params.alias}.isDeleted IS FALSE)`);

    if (params.paginate.sort) {
      const sortValues: string[] = params.paginate.sort.split(';');
      sortValues.forEach((sv: string) => {
        const value: string[] = sv.split(':');
        params.conditions.addOrderBy(
          `${params.alias}.${value[0]}`,
          +value[1] === 1 ? 'ASC' : 'DESC'
        );
      });
    }

    return params.conditions
      .limit(PAGE_SIZE)
      .offset((PAGE - 1) * PAGE_SIZE)
      .getMany();
  }
}
