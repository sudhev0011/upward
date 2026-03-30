import { ProviderBank } from "../../../domain/entities/provider-bank.entity";
import { CreateInput } from "../../../domain/types/common.types";
import { SaveProviderBankResponseDto } from "../../dtos/provider/kyc/save-provider-bank-response.dto";

export class ProviderBankMapper {
  static toEntity(data: {
    providerId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    branchName: string;
    passbookUrl: string;
    status: "pending" | "approved" | "rejected";
  }): CreateInput<ProviderBank> {
    return {
      providerId: data.providerId,
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      branchName: data.branchName,
      passbookUrl: data.passbookUrl,
      status : data.status
    };
  }

  static toResponse(data: ProviderBank): SaveProviderBankResponseDto {
    return {
      id: data.id,
      providerId: data.providerId,
      accountHolderName: data.accountHolderName,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
      branchName: data.branchName,
      passbookUrl: data.passbookUrl,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}
