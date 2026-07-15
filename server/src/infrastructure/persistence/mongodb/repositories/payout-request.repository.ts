import { Types } from "mongoose";
import { PayoutRequest } from "../../../../domain/entities/payout-request.entity";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { PayoutRequestDocument, PayoutRequestModel } from "../models/payout-request.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { PayoutRequestMapper } from "../../../mapers.persistence/payout-request/payout-request-mapper";

export class PayoutRequestRepository
  extends RepositoryBase<PayoutRequest, PayoutRequestDocument>
  implements IPayoutRequestRepository
{
  constructor() {
    super(PayoutRequestModel);
  }

  async findByProviderId(
    providerId: string,
    transaction?: ITransactionContext
  ): Promise<PayoutRequest[]> {
    const session = MongoSessionUtil.getSession(transaction);
    // Sort payout requests by createdAt descending so that newer requests show first
    const docs = await PayoutRequestModel.find({ providerId: new Types.ObjectId(providerId) })
      .sort({ createdAt: -1 })
      .session(session || null);
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findAll(
    transaction?: ITransactionContext
  ): Promise<PayoutRequest[]> {
    const session = MongoSessionUtil.getSession(transaction);
    const docs = await PayoutRequestModel.find({})
      .sort({ createdAt: -1 })
      .session(session || null);
    return docs.map((doc) => this.mapToEntity(doc));
  }

  protected mapToEntity(document: PayoutRequestDocument): PayoutRequest {
    return PayoutRequestMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<PayoutRequest>): Partial<PayoutRequestDocument> {
    return PayoutRequestMapper.mapToDocument(entity);
  }
}
