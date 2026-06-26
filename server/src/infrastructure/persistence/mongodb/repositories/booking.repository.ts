import { Booking } from "../../../../domain/entities/booking.entity";
import { BookingStatus } from "../../../../domain/enums/booking-status.enum";
import { IBookingRepository } from "../../../../domain/interfaces/repositories/booking/IBookingRepository";
import { BookingDocument, BookingModel } from "../models/booking.model";
import { ProviderSubscriptionModel } from "../models/provider-subscription.model";
import { WalletModel } from "../models/wallet.model";
import { WalletTransactionModel } from "../models/wallet-transaction.model";
import { PaymentModel } from "../models/payment.model";
import { ProviderProfileModel } from "../models/provider-profile.model";
import { UserModel } from "../models/user.model";
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
        status: {
        $in: [
          BookingStatus.CONFIRMED,
          BookingStatus.PROVIDER_COMPLETED,
        ],
      },
        paymentType: PaymentType.PARTIAL,
        paymentStatus: PaymentStatus.PARTIALLY_PAID,
      },
      transaction,
    );
  }

  async findBookingsReadyForPayout(before: Date): Promise<Booking[]> {
    const docs = await BookingModel.find({
      status: BookingStatus.CLIENT_COMPLETED,

      clientCompletedAt: {
        $lte: before,
      },
    });

    return docs.map((doc) => BookingMapper.mapToEntity(doc));
  }

  async findPendingPayoutBookings(providerId: string): Promise<Booking[]> {
    const docs = await BookingModel.find({
      providerId: new Types.ObjectId(providerId),
      status: {
        $in: [
          BookingStatus.CONFIRMED,
          BookingStatus.PROVIDER_COMPLETED,
          BookingStatus.CLIENT_COMPLETED,
        ],
      },
    });

    return docs.map((doc) => BookingMapper.mapToEntity(doc));
  }

  async getClientDashboardStats(
    clientId: string,
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    activeBookings: number;
    tasksCompleted: number;
    totalSpent: number;
    savedPros: number;
    spendingOverview: Array<{ label: string; spent: number }>;
  }> {
    const clientObjectId = new Types.ObjectId(clientId);

    const activeBookings = await BookingModel.countDocuments({
      clientId: clientObjectId,
      createdAt: { $gte: startDate },
      status: {
        $in: [
          BookingStatus.CONFIRMED,
          BookingStatus.PROVIDER_COMPLETED,
          BookingStatus.CLIENT_COMPLETED,
        ],
      },
    });

    const tasksCompleted = await BookingModel.countDocuments({
      clientId: clientObjectId,
      createdAt: { $gte: startDate },
      status: BookingStatus.COMPLETED,
    });

    const totalSpentResult = await BookingModel.aggregate([
      {
        $match: {
          clientId: clientObjectId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
        },
      },
    ]);
    const totalSpent = totalSpentResult[0]?.total || 0;

    const uniqueProviders = await BookingModel.distinct("providerId", {
      clientId: clientObjectId,
      createdAt: { $gte: startDate },
    });
    const savedPros = uniqueProviders.length;

    let dateGroupId: any;
    if (grouping === "hour") {
      dateGroupId = { $hour: "$createdAt" };
    } else if (grouping === "day") {
      dateGroupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (grouping === "week") {
      dateGroupId = { $week: "$createdAt" };
    } else {
      dateGroupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }

    const spendingOverviewResult = await BookingModel.aggregate([
      {
        $match: {
          clientId: clientObjectId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: dateGroupId,
          spent: { $sum: "$paidAmount" },
        },
      },
    ]);

    const dataMap = new Map<string | number, number>();
    for (const item of spendingOverviewResult) {
      if (item._id !== null && item._id !== undefined) {
        dataMap.set(item._id, item.spent);
      }
    }

    const sortedKeys = Array.from(dataMap.keys()).sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b));
    });

    const getLabel = (key: string | number) => {
      if (grouping === "hour") {
        return `${key}:00`;
      } else if (grouping === "day") {
        const date = new Date(String(key));
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (grouping === "week") {
        return `Week ${key}`;
      } else {
        const [year, month] = String(key).split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    };

    const spendingOverview = sortedKeys.map((key) => ({
      label: getLabel(key),
      spent: Math.round(dataMap.get(key) || 0),
    }));

    return {
      activeBookings,
      tasksCompleted,
      totalSpent,
      savedPros,
      spendingOverview,
    };
  }

  async getProviderDashboardStats(
    providerId: string,
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    totalOrders: number;
    upcomingBookingsCount: number;
    walletBalance: number;
    totalEarnings: number;
    earningsOverview: Array<{ label: string; earnings: number }>;
  }> {
    const providerObjectId = new Types.ObjectId(providerId);

    const totalOrders = await BookingModel.countDocuments({
      providerId: providerObjectId,
      createdAt: { $gte: startDate },
      status: { $nin: [BookingStatus.CANCELLED, BookingStatus.EXPIRED] },
    });

    const upcomingBookingsCount = await BookingModel.countDocuments({
      providerId: providerObjectId,
      status: BookingStatus.CONFIRMED,
      startDateTime: { $gt: new Date() },
    });

    const wallet = await WalletModel.findOne({ userId: providerObjectId });
    const walletBalance = wallet ? wallet.balance : 0;

    let totalEarnings = 0;
    let earningsOverview: Array<{ label: string; earnings: number }> = [];

    if (wallet) {
      const walletId = wallet._id;

      const totalEarningsResult = await WalletTransactionModel.aggregate([
        {
          $match: {
            walletId,
            type: "credit",
            category: "provider_payout",
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);
      totalEarnings = totalEarningsResult[0]?.total || 0;

      let dateGroupId: any;
      if (grouping === "hour") {
        dateGroupId = { $hour: "$createdAt" };
      } else if (grouping === "day") {
        dateGroupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
      } else if (grouping === "week") {
        dateGroupId = { $week: "$createdAt" };
      } else {
        dateGroupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
      }

      const earningsOverviewResult = await WalletTransactionModel.aggregate([
        {
          $match: {
            walletId,
            type: "credit",
            category: "provider_payout",
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: dateGroupId,
            earnings: { $sum: "$amount" },
          },
        },
      ]);

      const dataMap = new Map<string | number, number>();
      for (const item of earningsOverviewResult) {
        if (item._id !== null && item._id !== undefined) {
          dataMap.set(item._id, item.earnings);
        }
      }

      const sortedKeys = Array.from(dataMap.keys()).sort((a, b) => {
        if (typeof a === "number" && typeof b === "number") return a - b;
        return String(a).localeCompare(String(b));
      });

      const getLabel = (key: string | number) => {
        if (grouping === "hour") {
          return `${key}:00`;
        } else if (grouping === "day") {
          const date = new Date(String(key));
          return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } else if (grouping === "week") {
          return `Week ${key}`;
        } else {
          const [year, month] = String(key).split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
        }
      };

      earningsOverview = sortedKeys.map((key) => ({
        label: getLabel(key),
        earnings: Math.round(dataMap.get(key) || 0),
      }));
    }

    return {
      totalOrders,
      upcomingBookingsCount,
      walletBalance,
      totalEarnings,
      earningsOverview,
    };
  }

  async getAdminDashboardStats(
    startDate: Date,
    grouping: "hour" | "day" | "week" | "month",
  ): Promise<{
    pendingOrdersCount: number;
    totalRevenue: number;
    activeProviders: number;
    activeClients: number;
    revenueOverview: Array<{ label: string; revenue: number }>;
    serviceDistribution: Array<{ name: string; value: number; fill: string }>;
    recentTransactions: Array<{
      id: string;
      transactionId: string;
      clientName: string;
      amount: number;
      status: string;
    }>;
    topProviders: Array<{
      id: string;
      name: string;
      avatar: string;
      completedJobs: number;
      rating: number;
    }>;
  }> {
    const pendingOrdersCount = await BookingModel.countDocuments({
      status: { $in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      createdAt: { $gte: startDate },
    });

    const bookingRevenueResult = await BookingModel.aggregate([
      {
        $match: {
          status: BookingStatus.COMPLETED,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const bookingCommission = (bookingRevenueResult[0]?.total || 0) * 0.20;

    const subscriptionRevenueResult = await ProviderSubscriptionModel.aggregate([
      {
        $match: {
          status: { $in: ["active", "expired", "cancelled"] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);
    const subscriptionRevenue = subscriptionRevenueResult[0]?.total || 0;
    const totalRevenue = bookingCommission + subscriptionRevenue;

    const activeProviders = await UserModel.countDocuments({
      roles: "provider",
      isBlocked: false,
    });

    const activeClients = await UserModel.countDocuments({
      roles: "client",
      isBlocked: false,
    });

    // Grouping
    let dateGroupId: any;
    if (grouping === "hour") {
      dateGroupId = { $hour: "$createdAt" };
    } else if (grouping === "day") {
      dateGroupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (grouping === "week") {
      dateGroupId = { $week: "$createdAt" };
    } else {
      dateGroupId = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }

    const bookingTrend = await BookingModel.aggregate([
      {
        $match: {
          status: BookingStatus.COMPLETED,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: dateGroupId,
          amount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const subTrend = await ProviderSubscriptionModel.aggregate([
      {
        $match: {
          status: { $in: ["active", "expired", "cancelled"] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: dateGroupId,
          amount: { $sum: "$amount" },
        },
      },
    ]);

    const dataMap = new Map<string | number, number>();
    for (const item of bookingTrend) {
      if (item._id !== null && item._id !== undefined) {
        const comm = item.amount * 0.20;
        dataMap.set(item._id, comm);
      }
    }
    for (const item of subTrend) {
      if (item._id !== null && item._id !== undefined) {
        dataMap.set(item._id, (dataMap.get(item._id) || 0) + item.amount);
      }
    }

    const sortedKeys = Array.from(dataMap.keys()).sort((a, b) => {
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b));
    });

    const getLabel = (key: string | number) => {
      if (grouping === "hour") {
        return `${key}:00`;
      } else if (grouping === "day") {
        const date = new Date(String(key));
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else if (grouping === "week") {
        return `Week ${key}`;
      } else {
        const [year, month] = String(key).split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
    };

    const revenueOverview = sortedKeys.map((key) => ({
      label: getLabel(key),
      revenue: Math.round(dataMap.get(key) || 0),
    }));

    // Service distribution
    const distribution = await BookingModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$bookingMode",
          count: { $sum: 1 },
        },
      },
    ]);
    const totalBookings = distribution.reduce((sum, item) => sum + item.count, 0);
    const serviceDistribution = distribution.map((item) => {
      const percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0;
      const name = item._id === "onsite" ? "Onsite" : item._id === "offsite" ? "Offsite" : "Dedicated";
      const fill = item._id === "onsite" ? "#719FC4" : item._id === "offsite" ? "#6366F1" : "#8B5CF6";
      return { name, value: percentage, fill };
    });

    // Recent transactions
    const recentPayments = await PaymentModel.aggregate([
      {
        $sort: { createdAt: -1 }
      },
      {
        $limit: 5
      },
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
        $project: {
          id: "$_id",
          transactionId: { $ifNull: ["$stripePaymentIntentId", "$_id"] },
          clientName: { $ifNull: ["$client.name", "Unknown Client"] },
          amount: "$amount",
          status: "$transactionStatus"
        }
      }
    ]);

    // Top Providers
    const topProviders = await ProviderProfileModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "bookings",
          let: { providerId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$providerId", "$$providerId"] },
                    { $eq: ["$status", BookingStatus.COMPLETED] }
                  ]
                }
              }
            },
            {
              $count: "count"
            }
          ],
          as: "completedBookings"
        }
      },
      {
        $unwind: {
          path: "$completedBookings",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          id: "$userId",
          name: { $ifNull: ["$user.name", "Unknown Provider"] },
          avatar: { $ifNull: ["$user.avatarFileName", ""] },
          completedJobs: { $ifNull: ["$completedBookings.count", 0] },
          rating: { $ifNull: ["$ratingAvg", 5] }
        }
      },
      {
        $sort: { rating: -1, completedJobs: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return {
      pendingOrdersCount,
      totalRevenue,
      activeProviders,
      activeClients,
      revenueOverview,
      serviceDistribution,
      recentTransactions: recentPayments.map((p) => ({
        id: String(p.id),
        transactionId: String(p.transactionId),
        clientName: String(p.clientName),
        amount: Number(p.amount),
        status: String(p.status),
      })),
      topProviders: topProviders.map((tp) => ({
        id: String(tp.id),
        name: String(tp.name),
        avatar: tp.avatar ? String(tp.avatar) : String(tp.name).substring(0, 2).toUpperCase(),
        completedJobs: Number(tp.completedJobs),
        rating: Number(tp.rating),
      })),
    };
  }
}
