import mongoose, { Document, Model, Schema } from 'mongoose';
import { injectable, unmanaged } from 'inversify';
import { DuplicateModelError, ModelNotFoundError } from './utils/errors';
import { Repository, Query } from './utils/contract';

@injectable()
export class BaseRepository<T extends Document> implements Repository<T> {
  model: Model<T>;
  constructor(@unmanaged() private name: string, @unmanaged() schema: Schema) {
    this.model = mongoose.model<T>(name, schema);
  }

  create(attributes: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model.create(attributes, (err, result) => {
        if (err && err.code === 11000)
          return reject(new DuplicateModelError(`${this.name} exists already`));
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  byID(_id: string, projections?: any, archived?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model
        .findOne({
          _id,
          ...(!archived ? { deleted_at: undefined } : null),
        })
        .select(projections)
        .exec((err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          resolve(result);
        });
    });
  }

  byQuery(query: any, projections?: any, archived?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model
        .findOne({
          ...query,
          ...(!archived ? { deleted_at: undefined } : null),
        })
        .select(projections)
        .exec((err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          resolve(result);
        });
    });
  }

  all(query: Query): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const page = query.page || 0;
      const per_page = query.per_page || 20;
      const offset = page * per_page;
      this.model
        .find({
          ...query.conditions,
          ...(!query.archived ? { deleted_at: undefined } : null),
        })
        .limit(per_page)
        .select(query.projections)
        .skip(offset)
        .sort(query.sort || 'created_at')
        .exec((err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  }

  update(query: any, update: any): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model.findOne(query, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(new ModelNotFoundError(`${this.name} not found`));
        result.set(update);
        result.save((err, updatedDocument) => {
          if (err) return reject(err);
          resolve(updatedDocument);
        });
      });
    });
  }

  remove(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model.findByIdAndUpdate(
        id,
        {
          deleted_at: new Date(),
        },
        {
          new: true,
        },
        (err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(new ModelNotFoundError(`${this.name} not found`));
          resolve(result);
        }
      );
    });
  }

  destroy(id: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.model.findByIdAndDelete(id, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(new ModelNotFoundError(`${this.name} not found`));
        resolve(result);
      });
    });
  }
}
