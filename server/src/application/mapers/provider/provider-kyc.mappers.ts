import { ProviderKyc } from "../../../domain/entities/provider-kyc.entity";
import { CreateInput } from "../../../domain/types/common.types";
import { SubmitProviderKycResponseDto } from "../../dtos/provider/kyc/submit-provider-kyc-response.dto";

export class ProviderKycMapper {
  static toEntity(data: {
    providerId: string;
    fullName: string;
    aadhaarNumber: string;
    dateOfBirth: Date;
    address: string;
    aadhaarFrontUrl: string;
    aadhaarBackUrl: string;
    status: "pending" | "approved" | "rejected";
  }): CreateInput<ProviderKyc>{

    return {
        providerId : data.providerId,
        fullName : data.fullName,
        aadhaarNumber : data.aadhaarNumber,
        dateOfBirth : data.dateOfBirth,
        address : data.address,
        aadhaarFrontUrl : data.aadhaarFrontUrl,
        aadhaarBackUrl : data.aadhaarBackUrl,
        status : data.status,
        reason: "",
    }
  }

  static toResponse(data: ProviderKyc): SubmitProviderKycResponseDto{
    return {
        id: data.id,
        providerId: data.providerId,
        fullName: data.fullName,
        aadhaarNumber: data.aadhaarNumber,
        dateOfBirth : data.dateOfBirth.toISOString(),
        address : data.address,
        aadhaarFrontUrl: data.aadhaarFrontUrl,
        aadhaarBackUrl: data.aadhaarBackUrl,
        status: data.status,
        reason: data.reason,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    }
  }
}
