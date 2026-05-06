import { Types } from "mongoose";
import { RepositoryBase } from "./base.repository";
import { Unavailability } from "../../../../domain/entities/unavailability.entity";
import { UnavailabilityModel,UnavailabilityDocument } from "../models/unavailability.mode";
import { UnavailabilitySource } from "../../../../domain/enums/unavailability.enum";

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
    rangeEnd: Date
  ): Promise<Unavailability[]> {
    return this.findMany({
      providerId: new Types.ObjectId(providerId),
      startDate: { $lt: rangeEnd },
      endDate: { $gt: rangeStart },
    });
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
    return Unavailability.create({
      id: document._id.toString(),
      providerId: document.providerId.toString(),
      startDate: document.startDate,
      endDate: document.endDate,
      reason: document.reason ?? null,
      source: document.source,
      bookingId: document.bookingId?.toString() ?? null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }

  protected mapToDocument(
    entity: Partial<Unavailability>
  ): Partial<UnavailabilityDocument> {
    const doc: Record<string, unknown> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.startDate !== undefined) doc.startDate = entity.startDate;
    if (entity.endDate !== undefined) doc.endDate = entity.endDate;
    if (entity.reason !== undefined) doc.reason = entity.reason;
    if (entity.source !== undefined) doc.source = entity.source;
    if (entity.bookingId !== undefined)
      doc.bookingId = entity.bookingId
        ? new Types.ObjectId(entity.bookingId)
        : null;

    return doc as Partial<UnavailabilityDocument>;
  }
}