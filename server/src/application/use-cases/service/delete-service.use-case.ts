import { UserRole } from "../../../domain/enums/user-role.enum";
import { AuthorizationError, InternalServerError } from "../../../domain/errors/errors";
import { IServiceRepository } from "../../../domain/interfaces/repositories/service/IServiceRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/user/IUserRepository";
import { IDeleteServiceUseCase } from "../../../domain/interfaces/usecases/service/IDeleteServiceUseCase";

export class DeleteServiceUseCase implements IDeleteServiceUseCase{

    constructor(
        private readonly _serviceRespository: IServiceRepository,
        private readonly _userRepository: IUserRepository
    ){}

    async execute(data: { serviceId: string; userId: string; }): Promise<void> {
        
        const user = await this._userRepository.findById(data.userId)

        if(!user || !user.roles.includes(UserRole.ADMIN)){
            throw new AuthorizationError("Authorization error: only admin can edit service");
        }

        const success = await this._serviceRespository.delete(data.serviceId);

        if(!success){
            throw new InternalServerError("Database issue found")
        }
    }
}