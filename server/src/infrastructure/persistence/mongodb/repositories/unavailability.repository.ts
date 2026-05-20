import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { UnavailabilityModel,UnavailabilityDocument } from "../models/unavailability.mode";
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

  // Core query — find all blocks that overlap with a given date range.
  // Used when computing available slots for a provider.
  // Overlap condition: existing.startDate < rangeEnd AND existing.endDate > rangeStart
  async findOverlapping(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date,
    transaction?: ITransactionContext
  ): Promise<Unavailability[]> {
    const session =
      MongoSessionUtil.getSession(
        transaction,
      );
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      startDate: { $lt: rangeEnd },
      endDate: { $gt: rangeStart },
    },session);
  }

  async findBySource(
    providerId: string,
    source: UnavailabilitySource
  ): Promise<Unavailability[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      source,
    });
  }

  // When a booking is cancelled, remove the corresponding unavailability block
  async deleteByBookingId(bookingId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(bookingId)) return false;

    const result = await this.model.findOneAndDelete({
      bookingId: new Types.ObjectId(bookingId),
    });

    return result !== null;
  }

  // Delete all manual blocks for a provider in a date range
  async deleteManualInRange(
    providerId: string,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<number> {
    const result = await this.model.deleteMany({
      providerId: new Types.ObjectId(providerId),
      source: UnavailabilitySource.MANUAL,
      startDate: { $lt: rangeEnd },
      endDate: { $gt: rangeStart },
    });

    return result.deletedCount ?? 0;
  }

  // ─── Mappers ───────────────────────────────────────────────────────────────

  protected mapToEntity(document: UnavailabilityDocument): Unavailability {
    return UnavailabilityInfraMapper.mapToEntity(document)
  }

  protected mapToDocument(
    entity: Partial<Unavailability>
  ): Partial<UnavailabilityDocument> {
    return UnavailabilityInfraMapper.mapToDocument(entity)
  }
}