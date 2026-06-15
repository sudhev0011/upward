import { IReviewRepository } from '../../../domain/interfaces/repositories/review/IReviewRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';

export interface ReviewResponseDto {
  id: string;
  bookingId: string;
  clientId: string;
  providerId: string;
  serviceId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  client: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

export class GetProviderReviewsUseCase {
  constructor(
    private readonly _reviewRepository: IReviewRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(
    providerId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: ReviewResponseDto[]; total: number }> {
    const skip = (page - 1) * limit;
    const reviews = await this._reviewRepository.findByProviderId(providerId, limit, skip);
    const total = await this._reviewRepository.countDocuments({ providerId });

    const clientIds = reviews.map((r) => r.clientId);
    const clients = clientIds.length > 0 ? await this._userRepository.findByIds(clientIds) : [];
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    const data: ReviewResponseDto[] = reviews.map((r) => {
      const client = clientMap.get(r.clientId);
      return {
        id: r.id || '',
        bookingId: r.bookingId,
        clientId: r.clientId,
        providerId: r.providerId,
        serviceId: r.serviceId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        client: client
          ? {
              id: client.id,
              name: client.name,
              avatar: client.avatarFileName,
            }
          : null,
      };
    });

    return { data, total };
  }
}
