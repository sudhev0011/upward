import { PaginatedResult } from "../../../common.types";
import { CreateInput } from "../../../types/common.types";
import { ITransactionContext } from "../../database/transaction-context.interface";

export interface IBaseRepository<T> {
  create(entity: CreateInput<T>, transaction?: ITransactionContext): Promise<T>;
  findById(id: string,transaction?: ITransactionContext): Promise<T | null>;
  update(id: string, data: Partial<T>,transaction?: ITransactionContext): Promise<T | null>;
  delete(id: string, transaction?: ITransactionContext): Promise<boolean>;

  
  findOne(filter: Record<string, unknown>, transaction?: ITransactionContext): Promise<T | null>;
  findMany(filter: Record<string, unknown>, transaction?: ITransactionContext): Promise<T[]>;
  countDocuments(filter: Record<string, unknown>, transaction?: ITransactionContext): Promise<number>;
  
  
  paginate(
    filter: Record<string, unknown>,
    options?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    },
    transaction?: ITransactionContext
  ): Promise<PaginatedResult<T>>;
}