import { Types } from "mongoose";
import { ProviderKyc } from "../../domain/entities/provider-kyc.entity";
import { ProviderKycDocument } from "../persistence/mongodb/models/provider-kyc.model";

export class ProviderKycMapper {
  static toEntity(doc: ProviderKycDocument): ProviderKyc {
    return ProviderKyc.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      fullName: doc.fullName,
      aadhaarNumber: doc.aadhaarNumber,
      dateOfBirth: doc.dateOfBirth,
      address: doc.address,
      aadhaarFrontUrl: doc.aadhaarFrontUrl,
      aadhaarBackUrl: doc.aadhaarBackUrl,
      status: doc.status,
      reason: doc.reason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(
    entity: Partial<ProviderKyc>,
  ): Partial<ProviderKycDocument> {
    const doc: Partial<ProviderKycDocument> = {};

    if (entity.providerId !== undefined)
      doc.providerId = new Types.ObjectId(entity.providerId);
    if (entity.fullName !== undefined) doc.fullName = entity.fullName
    if (entity.aadhaarNumber !== undefined) doc.aadhaarNumber = entity.aadhaarNumber
    if(entity.dateOfBirth !== undefined) doc.dateOfBirth = entity.dateOfBirth
    if(entity.address !== undefined)  doc.address = entity.address
    if(entity.aadhaarFrontUrl !== undefined) doc.aadhaarFrontUrl = entity.aadhaarFrontUrl
    if(entity.aadhaarBackUrl !== undefined) doc.aadhaarBackUrl = entity.aadhaarBackUrl
    if(entity.status !== undefined) doc.status = entity.status
    if (entity.reason !== undefined) doc.reason = entity.reason

    return doc;
  }
}
