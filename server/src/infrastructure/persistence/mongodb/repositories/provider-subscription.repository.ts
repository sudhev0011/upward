import { QueryFilter, Types } from "mongoose";
import { ProviderSubscription } from "../../../../domain/entities/provider-subscription.entity";
import { IProviderSubscriptionRepository } from "../../../../domain/interfaces/repositories/provider-subscription/IProviderSubscriptionRepository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { RepositoryBase } from "./base.repository";
import {
  ProviderSubscriptionDocument,
  ProviderSubscriptionModel,
} from "../../mongodb/models/provider-subscription.model";
import { ProviderSubscriptionMapper } from "../../../mapers.persistence/provider-subscription/provider-subscription.mapper";

import { MongoSessionUtil } from "../helper/mongo-session.utils";

export class ProviderSubscriptionRepository
  extends RepositoryBase<ProviderSubscription, ProviderSubscriptionDocument>
  implements IProviderSubscriptionRepository
{
  constructor() {
    super(ProviderSubscriptionModel);
  }

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription | null> {
    return this.findOne(
      {
        stripePaymentIntentId,
      } as QueryFilter<ProviderSubscriptionDocument>,
      transaction,
    );
  }

  async findActiveSubscriptionByProviderId(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription | null> {
    const now = new Date();
    return this.findOne(
      {
        providerId: new Types.ObjectId(providerId),
        status: "active",
        endDate: { $gte: now },
      } as QueryFilter<ProviderSubscriptionDocument>,
      transaction,
    );
  }

  async findByProviderId(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<ProviderSubscription[]> {
    const session = MongoSessionUtil.getSession(transaction);
    const documents = await this.model
      .find({
        providerId: new Types.ObjectId(providerId),
      } as QueryFilter<ProviderSubscriptionDocument>)
      .sort({ createdAt: -1 })
      .session(session || null);
    return documents.map((doc) => this.mapToEntity(doc));
  }

  protected mapToEntity(
    document: ProviderSubscriptionDocument,
  ): ProviderSubscription {
    return ProviderSubscriptionMapper.toEntity(document);
  }

  protected mapToDocument(
    entity: Partial<ProviderSubscription>,
  ): Partial<ProviderSubscriptionDocument> {
    return ProviderSubscriptionMapper.toDocument(entity);
  }
}
