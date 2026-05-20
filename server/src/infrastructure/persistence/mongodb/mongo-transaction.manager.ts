import mongoose from "mongoose";
import { ITransactionManager } from "../../../domain/interfaces/database/transaction-manager.interface";
import { ITransactionContext } from "../../../domain/interfaces/database/transaction-context.interface";
import { MongoTransactionContext } from "./mongo-transaction-context";

export class MongoTransactionManager
  implements ITransactionManager
{
  async runInTransaction<T>(
    callback: (transaction: ITransactionContext) => Promise<T>
  ): Promise<T> {
    const session =
      await mongoose.startSession();

    session.startTransaction();

    try {

        const transactionContext =
        new MongoTransactionContext(
          session
        );

      const result =
        await callback(transactionContext);

      await session.commitTransaction();

      return result;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }
}