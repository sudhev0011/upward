import { Types } from "mongoose";
import { ProviderBank } from "../../domain/entities/provider-bank.entity";
import { ProviderBankDocument } from "../persistence/mongodb/models/provider-bank.model";

export class ProviderBankMapper {
  static toEntity(doc: ProviderBankDocument): ProviderBank {
    return ProviderBank.create({
      id: doc._id.toString(),
      providerId: doc.providerId.toString(),
      accountHolderName: doc.accountHolderName,
      bankName: doc.bankName,
      accountNumber: doc.accountNumber,
      ifscCode: doc.ifscCode,
      branchName: doc.branchName,
      passbookUrl: doc.passbookUrl,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toDocument(entity: Partial<ProviderBank>): Partial<ProviderBankDocument> {
    const doc: Partial<ProviderBankDocument> = {};  
    
    if(entity.providerId !== undefined) doc.providerId = new Types.ObjectId(entity.providerId)
    if(entity.accountHolderName !== undefined) doc.accountHolderName= entity.accountHolderName
    if(entity.bankName !== undefined) doc.bankName= entity.bankName
    if(entity.accountNumber !== undefined) doc.accountNumber= entity.accountNumber
    if(entity.ifscCode !== undefined) doc.ifscCode= entity.ifscCode
    if(entity.branchName !== undefined) doc.branchName= entity.branchName
    if(entity.passbookUrl !== undefined) doc.passbookUrl= entity.passbookUrl
    if(entity.status !== undefined) doc.status = entity.status

    return doc;
  }
}
