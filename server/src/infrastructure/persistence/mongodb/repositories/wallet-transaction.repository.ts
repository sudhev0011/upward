import { Types } from "mongoose";
import { WalletTransaction } from "../../../../domain/entities/wallet-transaction.entity";
import { IWalletTransactionRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletTransactionRepository";
import {
  WalletTransactionDocument,
  WalletTransactionModel,
} from "../models/wallet-transaction.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { WalletTransactionMapper } from "../../../mapers.persistence/wallet/wallet-transaction-mapper";

export class WalletTransactionRepository
  extends RepositoryBase<WalletTransaction, WalletTransactionDocument>
  implements IWalletTransactionRepository
{
  constructor() {
    super(WalletTransactionModel);
  }

  async findByWalletId(
    walletId: string,
    transaction?: ITransactionContext
  ): Promise<WalletTransaction[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany({ walletId: new Types.ObjectId(walletId) }, session);
  }

  protected mapToEntity(document: WalletTransactionDocument): WalletTransaction {
    return WalletTransactionMapper.mapToEntity(document);
  }

  protected mapToDocument(
    entity: Partial<WalletTransaction>
  ): Partial<WalletTransactionDocument> {
    return WalletTransactionMapper.mapToDocument(entity);
  }
}
