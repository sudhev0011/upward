import { Types } from "mongoose";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../../domain/interfaces/repositories/wallet/IWalletRepository";
import { WalletDocument, WalletModel } from "../models/wallet.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { WalletMapper } from "../../../mapers.persistence/wallet/wallet-mapper";

export class WalletRepository
  extends RepositoryBase<Wallet, WalletDocument>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel);
  }

  async findByUserId(
    userId: string,
    transaction?: ITransactionContext
  ): Promise<Wallet | null> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findOne({ userId: new Types.ObjectId(userId) }, session);
  }

  protected mapToEntity(document: WalletDocument): Wallet {
    return WalletMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<Wallet>): Partial<WalletDocument> {
    return WalletMapper.mapToDocument(entity);
  }
}
