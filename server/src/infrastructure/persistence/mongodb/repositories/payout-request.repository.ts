import { PipelineStage, Types } from "mongoose";
import { PayoutRequest } from "../../../../domain/entities/payout-request.entity";
import { ProviderBank } from "../../../../domain/entities/provider-bank.entity";
import { IPayoutRequestRepository } from "../../../../domain/interfaces/repositories/payout-request/IPayoutRequestRepository";
import { PayoutRequestDocument, PayoutRequestModel } from "../models/payout-request.model";
import { UserModel } from "../models/user.model";
import { ProviderBankModel } from "../models/provider-bank.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { PayoutRequestMapper } from "../../../mapers.persistence/payout-request/payout-request-mapper";
import {
  PayoutRequestQueryModel,
  PaginatedPayoutRequestsResponse,
  PayoutRequestPaginationOptions,
} from "../../../../domain/queries/admin/PayoutRequestQueryModel";

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
    options?: PayoutRequestPaginationOptions,
    transaction?: ITransactionContext
  ): Promise<PaginatedPayoutRequestsResponse> {
    const session = MongoSessionUtil.getSession(transaction);

    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const matchStage: Record<string, any> = {};
    if (options?.status) {
      matchStage.status = options.status;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "providerId",
          foreignField: "_id",
          as: "provider",
        },
      },
      {
        $unwind: {
          path: "$provider",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: ProviderBankModel.collection.name,
          localField: "providerId",
          foreignField: "providerId",
          as: "bankDetails",
        },
      },
      {
        $unwind: {
          path: "$bankDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (options?.search && options.search.trim() !== "") {
      const escaped = options.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escaped, "i");
      pipeline.push({
        $match: {
          $or: [
            { "provider.name": searchRegex },
            { "provider.email": searchRegex },
            { "bankDetails.bankName": searchRegex },
            { "bankDetails.accountNumber": searchRegex },
          ],
        },
      });
    }

    const countPipeline: PipelineStage[] = [...pipeline, { $count: "total" }];
    const dataPipeline: PipelineStage[] = [
      ...pipeline,
      { $skip: skip },
      { $limit: limit },
    ];

    const [dataResult, countResult] = await Promise.all([
      PayoutRequestModel.aggregate(dataPipeline).session(session || null),
      PayoutRequestModel.aggregate(countPipeline).session(session || null),
    ]);

    const total = countResult[0]?.total || 0;

    const data: PayoutRequestQueryModel[] = dataResult.map((item: any) => ({
      payoutRequest: PayoutRequest.create({
        id: item._id.toString(),
        providerId: item.providerId.toString(),
        amount: item.amount,
        status: item.status,
        adminNotes: item.adminNotes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }),
      provider: {
        name: item.provider?.name || "Unknown",
        email: item.provider?.email || "Unknown",
      },
      bankDetails: item.bankDetails
        ? ProviderBank.create({
            id: item.bankDetails._id.toString(),
            providerId: item.bankDetails.providerId.toString(),
            accountHolderName: item.bankDetails.accountHolderName,
            bankName: item.bankDetails.bankName,
            accountNumber: item.bankDetails.accountNumber,
            ifscCode: item.bankDetails.ifscCode,
            branchName: item.bankDetails.branchName,
            passbookUrl: item.bankDetails.passbookUrl,
            status: item.bankDetails.status,
            reason: item.bankDetails.reason,
            createdAt: item.bankDetails.createdAt,
            updatedAt: item.bankDetails.updatedAt,
          })
        : null,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  protected mapToEntity(document: PayoutRequestDocument): PayoutRequest {
    return PayoutRequestMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<PayoutRequest>): Partial<PayoutRequestDocument> {
    return PayoutRequestMapper.mapToDocument(entity);
  }
}

