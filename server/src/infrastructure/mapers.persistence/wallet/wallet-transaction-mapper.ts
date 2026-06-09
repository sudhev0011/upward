import { Types } from "mongoose";
import { WalletTransaction } from "../../../domain/entities/wallet-transaction.entity";
import { WalletTransactionDocument } from "../../persistence/mongodb/models/wallet-transaction.model";

export class WalletTransactionMapper {
  static mapToEntity(document: WalletTransactionDocument): WalletTransaction {
    return WalletTransaction.create({
      id: document._id.toString(),
      walletId: document.walletId.toString(),
      amount: document.amount,
      type: document.type,
      description: document.description,
      bookingId: document.bookingId?.toString() || null,
      createdAt: document.createdAt,
    });
  }

  static mapToDocument(
    entity: Partial<WalletTransaction>
  ): Partial<WalletTransactionDocument> {
    const doc: Partial<WalletTransactionDocument> = {};
    if (entity.walletId !== undefined) {
      doc.walletId = new Types.ObjectId(entity.walletId);
    }
    if (entity.amount !== undefined) {
      doc.amount = entity.amount;
    }
    if (entity.type !== undefined) {
      doc.type = entity.type;
    }
    if (entity.description !== undefined) {
      doc.description = entity.description;
    }
    if (entity.bookingId !== undefined) {
      doc.bookingId = entity.bookingId ? new Types.ObjectId(entity.bookingId) : null;
    }
    return doc;
  }
}
