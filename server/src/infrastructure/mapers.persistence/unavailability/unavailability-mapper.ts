import { Types } from "mongoose";
import { Unavailability } from "../../../domain/entities/unavailability.entity";
import { UnavailabilityDocument } from "../../persistence/mongodb/models/unavailability.mode";

export class UnavailabilityInfraMapper {
  static mapToEntity(document: UnavailabilityDocument): Unavailability {
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

  static mapToDocument(
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