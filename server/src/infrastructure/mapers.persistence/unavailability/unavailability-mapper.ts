import { Types } from "mongoose";
import { Unavailability } from "../../../domain/entities/unavailability.entity";
import { UnavailabilityDocument } from "../../persistence/mongodb/models/unavailability.mode";

export class UnavailabilityInfraMapper {
  static toEntity(doc: UnavailabilityDocument): Unavailability {
    return Unavailability.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      startDate: doc.startDate,
      endDate: doc.endDate,
      reason: doc.reason ?? null,
      source: doc.source,
      bookingId: doc.bookingId?.toString() ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<Unavailability>
  ): Partial<UnavailabilityDocument> {
    const doc: Partial<UnavailabilityDocument> = {};

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

    return doc;
  }
}