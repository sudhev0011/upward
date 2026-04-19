import { ProviderProfile } from "../provider/provider.interface";

export interface ProviderProfilesResponse{
    providers: ProviderProfile[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApproveProviderRequest{
    userId: string;
    isApprovedByAdmin: boolean;
}

export interface RejectProviderRequest{
    userId: string;
    isApprovedByAdmin: boolean;
    reason: string;
}

export interface BlockProviderRequest{
    userId: string;
    isBlocked: boolean;
}