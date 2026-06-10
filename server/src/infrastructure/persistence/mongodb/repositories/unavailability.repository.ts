import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import {
  UnavailabilityModel,
  UnavailabilityDocument,
} from "../models/unavailability.mode";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";
import { ITransactionContext } from "../../../../domain/interfaces/database/transaction-context.interface";
import { MongoSessionUtil } from "../helper/mongo-session.utils";
import { UnavailabilityInfraMapper } from "../../../mapers.persistence/unavailability/unavailability-mapper";

export class UnavailabilityRepository extends RepositoryBase<
  Unavailability,
  UnavailabilityDocument
> {
  constructor() {
    super(UnavailabilityModel);
  }

  async findByProviderId(providerId: string): Promise<Unavailability[]> {
    return this.findMany({ providerId: new Types.ObjectId(providerId) });
  }

  async findOverlapping(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date,
    transaction?: ITransactionContext,
  ): Promise<Unavailability[]> {
    const session = MongoSessionUtil.getSession(transaction);
    return this.findMany(
      {
        providerId: new Types.ObjectId(providerId),
        startDate: { $lt: rangeEnd },
        endDate: { $gt: rangeStart },
      },
      session,
    );
  }

  async findBySource(
    providerId: string,
    source: UnavailabilitySource,
  ): Promise<Unavailability[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      source,
    });
  }

  async deleteByBookingId(
    bookingId: string,
    transaction?: ITransactionContext,
  ): Promise<boolean> {
    const session = MongoSessionUtil.getSession(transaction);

    const result = await this.model.deleteOne(
      {
        bookingId,
        source: UnavailabilitySource.BOOKING,
      },
      {
        session,
      },
    );

    return result.deletedCount > 0;
  }

  async deleteManualInRange(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date,
  ): Promise<number> {
    const result = await this.model.deleteMany({
      providerId: new Types.ObjectId(providerId),
      source: UnavailabilitySource.MANUAL,
      startDate: { $lt: rangeEnd },
      endDate: { $gt: rangeStart },
    });

    return result.deletedCount ?? 0;
  }


  protected mapToEntity(document: UnavailabilityDocument): Unavailability {
    return UnavailabilityInfraMapper.mapToEntity(document);
  }

  protected mapToDocument(
    entity: Partial<Unavailability>,
  ): Partial<UnavailabilityDocument> {
    return UnavailabilityInfraMapper.mapToDocument(entity);
  }
}
