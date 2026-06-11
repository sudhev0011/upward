import { IReviewRepository } from '../../../domain/interfaces/repositories/review/IReviewRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';

export interface ClientReviewResponseDto {
  id: string;
  bookingId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  provider: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

export class GetClientReviewsUseCase {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    clientId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: ClientReviewResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const reviews = await this._reviewRepository.findByClientId(clientId, limit, skip);
    const total = await this._reviewRepository.countDocuments({ clientId });

    const providerIds = reviews.map((r) => r.providerId);
    const providers = providerIds.length > 0 ? await this._userRepository.findByIds(providerIds) : [];
    const providerMap = new Map(providers.map((p) => [p.id, p]));

    const data: ClientReviewResponseDto[] = reviews.map((r) => {
      const provider = providerMap.get(r.providerId);
      return {
        id: r.id || '',
        bookingId: r.bookingId,
        clientId: r.clientId,
        providerId: r.providerId,
        serviceId: r.serviceId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        provider: provider
          ? {
              id: provider.id,
              name: provider.name,
              avatar: provider.avatarFileName,
            }
          : null,
      };
    });

    return { data, total };
  }
}
