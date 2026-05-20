import { ITransactionContext } from "./transaction-context.interface";

export interface ITransactionManager {
  runInTransaction<T>(
    callback: (
      transaction: ITransactionContext
    ) => Promise<T>
  ): Promise<T>;
}