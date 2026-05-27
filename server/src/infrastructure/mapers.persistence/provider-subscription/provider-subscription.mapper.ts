import { Types } from "mongoose";
import { ProviderSubscription } from "../../../domain/entities/provider-subscription.entity";
import { ProviderSubscriptionDocument } from "../../persistence/mongodb/models/provider-subscription.model";

export class ProviderSubscriptionMapper {
  static toEntity(doc: ProviderSubscriptionDocument): ProviderSubscription {
    return ProviderSubscription.create({
      id: String(doc._id),
      providerId: String(doc.providerId),
      planId: String(doc.planId),
      amount: doc.amount,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      stripePaymentIntentId: doc.stripePaymentIntentId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<ProviderSubscription>,
  ): Partial<ProviderSubscriptionDocument> {
    const doc: Partial<ProviderSubscriptionDocument> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.planId !== undefined)
      doc.planId = new Types.ObjectId(entity.planId);
    if (entity.amount !== undefined) doc.amount = entity.amount;
    if (entity.status !== undefined) doc.status = entity.status;
    if (entity.startDate !== undefined) doc.startDate = entity.startDate;
    if (entity.endDate !== undefined) doc.endDate = entity.endDate;
    if (entity.stripePaymentIntentId !== undefined)
      doc.stripePaymentIntentId = entity.stripePaymentIntentId;

    return doc;
  }
}
