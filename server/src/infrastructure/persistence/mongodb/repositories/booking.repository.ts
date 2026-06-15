import { Booking } from "../../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../../domain/enums/booking-status.enum";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { BookingDocument, BookingModel } from "../models/booking.model";
import { RepositoryBase } from "./base.repository";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { BookingMapper } from "../../../mapers.persistence/booking/booking-mapper";
import { PipelineStage, Types } from "mongoose";
import {
  ListBookingsResponse,
  BookingListItemResponse,
} from "../../../../domain/queries/booking/list-bookings-response";
import { PaymentStatus } from "../../../../domain/enums/payment-status.enum";
import { BookingMode } from "../../../../domain/enums/bookingMode.enum";
import { PaymentType } from "../../../../domain/enums/payment-type.enum";
export class BookingRepository
  extends RepositoryBase<Booking, BookingDocument>
  implements IBookingRepository
{
  constructor() {
    super(BookingModel);
  }

  protected mapToEntity(document: BookingDocument): Booking {
    return BookingMapper.mapToEntity(document);
  }

  protected mapToDocument(entity: Partial<Booking>): Partial<BookingDocument> {
    return BookingMapper.mapToDocument(entity);
  }

  async findOverlappingActiveBooking(
    providerId: string,
    startDateTime: Date,
    endDateTime: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findOne(
      {
        providerId,

        status: {
          $in: [
            BookingStatus.PENDING,
            BookingStatus.CONFIRMED,
            BookingStatus.COMPLETED,
          ],
        },

        startDateTime: {
          $lt: endDateTime,
        },

        endDateTime: {
          $gt: startDateTime,
        },
      },
      session,
    );
  }

  async findExpiredPendingBookings(
    currentDate: Date,
    transaction?: ITransactionContext,
  ): Promise<Booking[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        status: BookingStatus.PENDING,

        expiresAt: {
          $lte: currentDate,
        },
      },
      session,
    );
  }

  async findProviderBookings(
    providerId: string,
    transaction?: ITransactionContext,
  ): Promise<Booking[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        providerId,
      },
      session,
    );
  }

  async findCustomerBookings(clientId: string): Promise<Booking[]> {
    return this.findMany({
      clientId,
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return this.findMany({
      status,
    });
  }

  async findPendingBookingByIdAndClientId(
    bookingId: string,

    clientId: string,

    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    return this.findOne(
      {
        _id: bookingId,

        clientId,

        status: BookingStatus.PENDING,
      },
      transaction,
    );
  }

  async listBookings(params: {
    page?: number;
    limit?: number;

    search?: string;

    sortOrder?: "asc" | "desc";

    status?: BookingStatus[];

    paymentStatus?: PaymentStatus[];

    fromDate?: string;
    toDate?: string;

    providerId?: string;
    clientId?: string;
  }): Promise<ListBookingsResponse> {
    const page = params.page || 1;

    const limit = params.limit || 10;

    const skip = (page - 1) * limit;

    const sortOrder = params.sortOrder === "asc" ? 1 : -1;

    const matchStage: Record<string, unknown> = {};

    if (params.providerId) {
      matchStage.providerId = new Types.ObjectId(params.providerId);
    }

    if (params.clientId) {
      matchStage.clientId = new Types.ObjectId(params.clientId);
    }

    if (params.providerId) {
      matchStage.providerId = new Types.ObjectId(params.providerId);
    }

    if (params.clientId) {
      matchStage.clientId = new Types.ObjectId(params.clientId);
    }

    if (params.status?.length) {
      matchStage.status = {
        $in: params.status,
      };
    }

    if (params.paymentStatus?.length) {
      matchStage.paymentStatus = {
        $in: params.paymentStatus,
      };
    }

    if (params.fromDate || params.toDate) {
      matchStage.bookingDate = {};

      if (params.fromDate) {
        (matchStage.bookingDate as Record<string, string>).$gte =
          params.fromDate;
      }

      if (params.toDate) {
        (matchStage.bookingDate as Record<string, string>).$lte = params.toDate;
      }
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
    ];

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "clientId",
        foreignField: "_id",
        as: "client",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$client",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "providerId",
        foreignField: "_id",
        as: "provider",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$provider",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$service",
        preserveNullAndEmptyArrays: true,
      },
    });

    pipeline.push({
      $lookup: {
        from: "providerservices",
        localField: "providerServiceId",
        foreignField: "_id",
        as: "providerService",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$providerService",
        preserveNullAndEmptyArrays: true,
      },
    });

    if (params.search?.trim()) {
      const regex = new RegExp(params.search.trim(), "i");

      pipeline.push({
        $match: {
          $or: [
            { "client.name": regex },

            { "provider.name": regex },

            { "service.name": regex },

            { "location.address": regex },

            { status: regex },

            { paymentStatus: regex },

            { bookingDate: regex },

            { bookingId: regex },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        bookingDate: sortOrder,
      },
    });

    pipeline.push({
      $facet: {
        data: [
          {
            $skip: skip,
          },

          {
            $limit: limit,
          },

          {
            $project: {
              id: "$_id",
              bookingId: 1,

              status: 1,
              paymentStatus: 1,
              paymentType: 1,

              totalAmount: 1,
              paidAmount: 1,
              remainingAmount: 1,
              refundAmount: 1,

              bookingDate: 1,

              bookingMode: 1,

              startDateTime: 1,
              endDateTime: 1,

              notes: 1,

              requirements: 1,

              location: 1,

              client: {
                id: "$client._id",
                name: "$client.name",
                email: "$client.email",
                avatarFileName: "$client.avatarFileName",
              },

              provider: {
                id: "$provider._id",
                name: "$provider.name",
                email: "$provider.email",
                avatarFileName: "$provider.avatarFileName",
              },

              service: {
                id: "$service._id",
                name: "$service.name",
                description: "$service.description",
                mode: "$service.mode",
              },

              providerService: {
                id: "$providerService._id",
                price: "$providerService.price",
                status: "$providerService.status",
              },

              createdAt: 1,
              updatedAt: 1,
            },
          },
        ],

        totalCount: [
          {
            $count: "count",
          },
        ],
      },
    });

    const result = await BookingModel.aggregate(pipeline);

    const bookings = result[0]?.data || [];

    const total = result[0]?.totalCount?.[0]?.count || 0;

    return {
      data: bookings as BookingListItemResponse[],

      total,

      page,
      limit,

      totalPages: Math.ceil(total / limit),
    };
  }

  async findPreviousActiveBooking(
    providerId: string,

    bookingDate: string,

    startDateTime: Date,

    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    const session = MongoSessionUtil.getSession(transaction);

    const document = await this.model
      .findOne({
        providerId,

        bookingDate,

        endDateTime: {
          $lte: startDateTime,
        },

        status: {
          $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      })
      .sort({
        endDateTime: -1,
      })
      .session(session ?? null);

    return document ? this.mapToEntity(document) : null;
  }

  async findNextActiveBooking(
    providerId: string,

    bookingDate: string,

    endDateTime: Date,

    transaction?: ITransactionContext,
  ): Promise<Booking | null> {
    const session = MongoSessionUtil.getSession(transaction);

    const document = await this.model
      .findOne({
        providerId,

        bookingDate,

        startDateTime: {
          $gte: endDateTime,
        },

        status: {
          $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      })
      .sort({
        startDateTime: 1,
      })
      .session(session ?? null);

    return document ? this.mapToEntity(document) : null;
  }

  async countActiveOffsiteBookingsForDate(
    providerServiceId: string,

    bookingDate: string,

    transaction?: ITransactionContext,
  ): Promise<number> {
    const session = MongoSessionUtil.getSession(transaction);

    return this.model
      .countDocuments({
        providerServiceId,

        bookingDate,

        bookingMode: BookingMode.OFFSITE,

        status: {
          $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      })
      .session(session ?? null);
  }

  async findConfirmedPartialBookingByIdAndClientId(
  bookingId: string,
  clientId: string,
  transaction?: ITransactionContext,
): Promise<Booking | null> {
  return this.findOne(
    {
      _id: bookingId,
      clientId,
      status: BookingStatus.CONFIRMED,
      paymentType: PaymentType.PARTIAL,
      paymentStatus: PaymentStatus.PARTIALLY_PAID,
    },
    transaction,
  );
}
}
