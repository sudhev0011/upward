import { IProviderProfileRepository } from '../../../../domain/interfaces/repositories/provider/IProviderProfileRepository';
import { ICreateProviderProfileUseCase } from '../../../../domain/interfaces/usecases/provider/profile/ICreateProviderProfileUseCase';
import { ValidationError } from '../../../../domain/errors/errors';
import { ProviderProfileMapper } from '../../../mapers/provider/provider-profile.mappers';
import { ProviderProfileResponseDto } from '../../../dtos/provider/profile/info/response/provider-profile-response.dto';
import { CreateProviderProfileRequestDto } from '../../../dtos/provider/profile/info/request/create-provider-profile-request.dto';

export class CreateProviderProfileUseCase implements ICreateProviderProfileUseCase {
  constructor(
    private readonly _providerProfileRepository: IProviderProfileRepository,
  ) {}

  async execute(dto: CreateProviderProfileRequestDto): Promise<ProviderProfileResponseDto> {
    const { userId } = dto;
    const existingProfile = await this._providerProfileRepository.findOne({ userId });
    if (existingProfile) {
      throw new ValidationError('Profile already exists. Use update endpoint to modify.');
    }

    const profile = await this._providerProfileRepository.create(
      ProviderProfileMapper.toEntity({
        userId,
        bio: dto.bio,
        location: dto.location,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        gender: dto.gender,
        skills: dto.skills,
        languages: dto.languages,
        socialLinks: dto.socialLinks,
        experince: dto.experience
      }),
    );

    return ProviderProfileMapper.toResponse(profile);
  }
}

