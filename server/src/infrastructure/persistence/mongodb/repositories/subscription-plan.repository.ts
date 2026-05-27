import { QueryFilter } from "mongoose";
import { SubscriptionPlan } from "../../../../domain/entities/subscription-plan.entity";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repositories/subscription-plan/ISubscriptionPlanRepository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { RepositoryBase } from "./base.repository";
import {
  SubscriptionPlanDocument,
  SubscriptionPlanModel,
} from "../../mongodb/models/subscription-plan.model";
import { SubscriptionPlanMapper } from "../../../mapers.persistence/subscription-plan/subscription-plan.mapper";

import { MongoSessionUtil } from "../helper/mongo-session.utils";

export class SubscriptionPlanRepository
  extends RepositoryBase<SubscriptionPlan, SubscriptionPlanDocument>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel);
  }

  async findActivePlans(
    transaction?: ITransactionContext,
  ): Promise<SubscriptionPlan[]> {
    const session = MongoSessionUtil.getSession(transaction);
    const documents = await this.model
      .find({ isActive: true } as QueryFilter<SubscriptionPlanDocument>)
      .session(session || null);
    return documents.map((doc) => this.mapToEntity(doc));
  }

  async findByName(
    name: string,
    transaction?: ITransactionContext,
  ): Promise<SubscriptionPlan | null> {
    return this.findOne(
      { name } as QueryFilter<SubscriptionPlanDocument>,
      transaction,
    );
  }

  protected mapToEntity(document: SubscriptionPlanDocument): SubscriptionPlan {
    return SubscriptionPlanMapper.toEntity(document);
  }

  protected mapToDocument(
    entity: Partial<SubscriptionPlan>,
  ): Partial<SubscriptionPlanDocument> {
    return SubscriptionPlanMapper.toDocument(entity);
  }
}
