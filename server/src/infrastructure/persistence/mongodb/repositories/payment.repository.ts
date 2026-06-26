import { QueryFilter } from "mongoose";
import { Payment } from "../../../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../../../domain/interfaces/repositories/payment/IPaymentRepository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { RepositoryBase } from "./base.repository";
import {
  PaymentDocument,
  PaymentModel,
} from "../../mongodb/models/payment.model";
import { PaymentMapper } from "../../../mapers.persistence/payment/payment.mapper";
import { PaymentTransactionStatus } from "../../../../domain/enums/payment-transaction-status.enum";

export class PaymentRepository
  extends RepositoryBase<Payment, PaymentDocument>
  implements IPaymentRepository
{
  constructor() {
    super(PaymentModel);
  }

  /**
   * Find by Stripe PaymentIntent ID
   */

  async findByStripePaymentIntentId(
    stripePaymentIntentId: string,
    transaction?: ITransactionContext,
  ): Promise<Payment | null> {
    return this.findOne(
      {
        stripePaymentIntentId,
      } as QueryFilter<PaymentDocument>,
      transaction,
    );
  }

  async findPendingPaymentByBookingId(
    bookingId: string,

    transaction?: ITransactionContext,
  ): Promise<Payment | null> {
    return this.findOne(
      {
        bookingId,

        transactionStatus: PaymentTransactionStatus.PENDING,
      },
      transaction,
    );
  }

  async getPaymentsWithDetails(options: {
    page?: number;
    limit?: number;
    search?: string;
    transactionStatus?: string;
  }): Promise<{
    data: Array<{
      id: string;
      transactionId: string;
      clientId: string;
      clientName: string;
      clientEmail: string;
      providerId: string;
      providerName: string;
      providerEmail: string;
      bookingId: string;
      amount: number;
      currency: string;
      transactionStatus: string;
      paymentType: string;
      paidAt: Date | null;
      createdAt: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const matchStage: any = {};
    if (options.transactionStatus) {
      matchStage.transactionStatus = options.transactionStatus;
    }

    const pipeline: any[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } }
    ];

    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "providerId",
          foreignField: "_id",
          as: "provider"
        }
      },
      {
        $unwind: {
          path: "$provider",
          preserveNullAndEmptyArrays: true
        }
      }
    );

    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      pipeline.push({
        $match: {
          $or: [
            { "client.name": searchRegex },
            { "client.email": searchRegex },
            { "provider.name": searchRegex },
            { "provider.email": searchRegex },
            { stripePaymentIntentId: searchRegex }
          ]
        }
      });
    }

    const countPipeline = [...pipeline, { $count: "total" }];

    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          id: "$_id",
          transactionId: { $ifNull: ["$stripePaymentIntentId", "$_id"] },
          clientId: "$clientId",
          clientName: { $ifNull: ["$client.name", "Unknown Client"] },
          clientEmail: { $ifNull: ["$client.email", ""] },
          providerId: "$providerId",
          providerName: { $ifNull: ["$provider.name", "Unknown Provider"] },
          providerEmail: { $ifNull: ["$provider.email", ""] },
          bookingId: "$bookingId",
          amount: "$amount",
          currency: "$currency",
          transactionStatus: "$transactionStatus",
          paymentType: "$paymentType",
          paidAt: "$paidAt",
          createdAt: "$createdAt"
        }
      }
    );

    const [dataResult, countResult] = await Promise.all([
      PaymentModel.aggregate(pipeline),
      PaymentModel.aggregate(countPipeline)
    ]);

    const total = countResult[0]?.total || 0;

    const data = dataResult.map((item: any) => ({
      id: item.id.toString(),
      transactionId: item.transactionId,
      clientId: item.clientId ? item.clientId.toString() : "",
      clientName: item.clientName,
      clientEmail: item.clientEmail,
      providerId: item.providerId ? item.providerId.toString() : "",
      providerName: item.providerName,
      providerEmail: item.providerEmail,
      bookingId: item.bookingId ? item.bookingId.toString() : "",
      amount: item.amount,
      currency: item.currency,
      transactionStatus: item.transactionStatus,
      paymentType: item.paymentType,
      paidAt: item.paidAt,
      createdAt: item.createdAt,
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  protected mapToEntity(document: PaymentDocument): Payment {
    return PaymentMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<Payment>): Partial<PaymentDocument> {
    return PaymentMapper.mapToDocument(entity);
  }
}
