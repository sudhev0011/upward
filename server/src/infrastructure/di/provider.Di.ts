import { CreateProviderProfileRequestDtoSchema } from "../../application/dtos/provider/profile/info/request/create-provider-profile-request.dto";
import { CreateProviderProfileUseCase } from "../../application/use-cases/provider/profile/create-provider-profile.use-case";
import { GetProviderProfileUseCase } from "../../application/use-cases/provider/profile/get-provider-profile.use-case";
import { UpdateProviderProfileUseCase } from "../../application/use-cases/provider/profile/update-provider-profile.use-case";
import { UpdateClientProfileController } from "../../presentation/controllers/client/profile/update-client-profile.controller";
import { CreateProviderProfileController } from "../../presentation/controllers/provider/profile/create-provider-profile.controller";
import { GetProviderProfileController } from "../../presentation/controllers/provider/profile/get-provider-profile.controller";
import { UpdateProviderProfileController } from "../../presentation/controllers/provider/profile/update-provider-profile.controller";
import { ProviderProfileRepository } from "../persistence/mongodb/repositories/provider-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";


//repo init
const userRepository = new UserRepository() 
const providerProfileRepository = new ProviderProfileRepository()


// useCase init
const getProviderProfileUseCase = new GetProviderProfileUseCase(providerProfileRepository,userRepository)
const updateProviderProfileUseCase = new UpdateProviderProfileUseCase(providerProfileRepository,userRepository)
const createProviderProfileUseCase = new CreateProviderProfileUseCase(providerProfileRepository)

// contrller init
export const getProviderProfileController = new GetProviderProfileController(getProviderProfileUseCase)
export const updateProviderProfileController = new UpdateProviderProfileController(updateProviderProfileUseCase)
export const createProviderProfileController = new CreateProviderProfileController(createProviderProfileUseCase)