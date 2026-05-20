import { ClientSession } from "mongoose";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoTransactionContext } from "../mongo-transaction-context";


export class MongoSessionUtil {
  static getSession(
    transaction?: ITransactionContext
  ): ClientSession | undefined {
    if (
      transaction instanceof
      MongoTransactionContext
    ) {
      return transaction.session;
    }

    return undefined;
  }
}