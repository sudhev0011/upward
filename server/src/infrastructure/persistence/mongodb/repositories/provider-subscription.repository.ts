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
import { SubscriptionPlanDocument } from "../models/subscription-plan.model";
import { PlanFeatures } from "../../../../domain/interfaces/subscription-plan.interface";

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

  async getActivePlanLimitsByProvider(
    providerId: string,
  ): Promise<PlanFeatures> {
    const activeSubscription = await ProviderSubscriptionModel.findOne({
      providerId: providerId,
      status: "active",
      endDate: { $gte: new Date() },
    }).populate<{ planId: SubscriptionPlanDocument }>("planId");

    if (!activeSubscription || !activeSubscription.planId) {
      return {
        maxServices: 2,
        maxPortfolios: 2,
        maxManualUnavailability: 2,
      };
    }
    return {
      maxServices: activeSubscription.planId.features.maxServices,
      maxPortfolios: activeSubscription.planId.features.maxPortfolios,
      maxManualUnavailability: activeSubscription.planId.features.maxManualUnavailability,
    };
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
