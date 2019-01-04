export interface Query {
  archived?: boolean;
  conditions: any;
  page?: number;
  per_page?: number;
  projections?: any;
  sort?: string | object;
}

export interface Repository<T> {
  create(attributes: any): Promise<T>;
  byID(id: string, projections?: any, archived?: boolean): Promise<T>;
  byQuery(query: any, projections?: any, archived?: boolean): Promise<T>;
  all(query: Query): Promise<T[]>;
  update(query: any, update: any): Promise<T>;
  remove(id: string): Promise<T>;
  destroy(id: string): Promise<T>;
}
