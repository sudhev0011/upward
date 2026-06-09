import { Types } from "mongoose";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { WalletDocument } from "../../persistence/mongodb/models/wallet.model";

export class WalletMapper {
  static mapToEntity(document: WalletDocument): Wallet {
    return Wallet.create({
      id: document._id.toString(),
      userId: document.userId.toString(),
      balance: document.balance,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static mapToDocument(entity: Partial<Wallet>): Partial<WalletDocument> {
    const doc: Partial<WalletDocument> = {};
    if (entity.userId !== undefined) {
      doc.userId = new Types.ObjectId(entity.userId);
    }
    if (entity.balance !== undefined) {
      doc.balance = entity.balance;
    }
    return doc;
  }
}
