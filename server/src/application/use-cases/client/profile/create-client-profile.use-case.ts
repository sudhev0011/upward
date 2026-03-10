import { ValidationError } from "../../../../domain/errors/errors";
import { ICreateClientProfileUseCase } from "../../../../domain/interfaces/usecases/client/profile/ICreateClientProfileUseCase";
import { CreateClientProfileRequestDto } from "../../../dtos/client/profile/info/request/create-client-profile-request.dto";
import { ClientProfileResponseDto } from "../../../dtos/client/profile/info/response/client-profile-response.dto";
import { IClientProfileRepository } from "../../../../domain/interfaces/repositories/client/IClientProfileRepository";
import { ClientProfileMapper } from "../../../mapers/client/client-profile.mappers";
export class CreateClientProfileUseCase implements ICreateClientProfileUseCase {
  constructor(
    private readonly _clientProfileRepository: IClientProfileRepository
  ) {}

  async execute(
    dto: CreateClientProfileRequestDto,
  ): Promise<ClientProfileResponseDto> {
    const { userId } = dto;

    const existingProfile = await this._clientProfileRepository.findOne({
      userId,
    });

    if (existingProfile) {
      throw new ValidationError("Profile already exists. Use updating data");
    }

    const profile = await this._clientProfileRepository.create(
        ClientProfileMapper.toEntity({
        userId,
        location: dto.location,
        phone: dto.phone,
      }),
    );

    return ClientProfileMapper.toResponse(profile);
  }
}
