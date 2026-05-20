import { ClientSession } from "mongoose";
import { ITransactionContext } from "../../../domain/interfaces/database/transaction-context.interface";

export class MongoTransactionContext
  implements ITransactionContext
{
  constructor(
    public readonly session: ClientSession
  ) {}
}