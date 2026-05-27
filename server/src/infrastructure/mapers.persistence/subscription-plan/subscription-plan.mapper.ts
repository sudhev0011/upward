import { SubscriptionPlan } from "../../../domain/entities/subscription-plan.entity";
import { SubscriptionPlanDocument } from "../../persistence/mongodb/models/subscription-plan.model";

export class SubscriptionPlanMapper {
  static toEntity(doc: SubscriptionPlanDocument): SubscriptionPlan {
    return SubscriptionPlan.create({
      id: String(doc._id),
      name: doc.name,
      price: doc.price,
      billingCycle: doc.billingCycle,
      features: doc.features,
      subscriberCount: doc.subscriberCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<SubscriptionPlan>,
  ): Partial<SubscriptionPlanDocument> {
    const doc: Partial<SubscriptionPlanDocument> = {};

    if (entity.name !== undefined) doc.name = entity.name;
    if (entity.price !== undefined) doc.price = entity.price;
    if (entity.billingCycle !== undefined) doc.billingCycle = entity.billingCycle;
    if (entity.features !== undefined) doc.features = entity.features;
    if (entity.subscriberCount !== undefined)
      doc.subscriberCount = entity.subscriberCount;
    if (entity.isActive !== undefined) doc.isActive = entity.isActive;

    return doc;
  }
}
