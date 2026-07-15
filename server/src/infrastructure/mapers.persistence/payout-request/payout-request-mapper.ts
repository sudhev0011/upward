import { Types } from "mongoose";
import { PayoutRequest } from "../../../domain/entities/payout-request.entity";
import { PayoutRequestDocument } from "../../persistence/mongodb/models/payout-request.model";

export class PayoutRequestMapper {
  static mapToEntity(document: PayoutRequestDocument): PayoutRequest {
    return PayoutRequest.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      amount: document.amount,
      status: document.status,
      adminNotes: document.adminNotes,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  static mapToDocument(entity: Partial<PayoutRequest>): Partial<PayoutRequestDocument> {
    const doc: Partial<PayoutRequestDocument> = {};
    if (entity.id !== undefined) doc._id = new Types.ObjectId(entity.id);
    if (entity.providerId !== undefined) doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.amount !== undefined) doc.amount = entity.amount;
    if (entity.status !== undefined) doc.status = entity.status;
    if (entity.adminNotes !== undefined) doc.adminNotes = entity.adminNotes;
    return doc;
  }
}
