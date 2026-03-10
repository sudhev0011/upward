// controller import
import { CreateClientProfileController } from "../../presentation/controllers/client/profile/create-client-profile.controller";
import { GetClientProfileController } from "../../presentation/controllers/client/profile/get-client-profile.controller";
import { UpdateClientProfileController } from "../../presentation/controllers/client/profile/update-client-profile.controller";

//useCase import 
import { CreateClientProfileUseCase } from "../../application/use-cases/client/profile/create-client-profile.use-case";
import { GetClientProfileUseCase } from "../../application/use-cases/client/profile/get-client-profile.use-case";
import { UpdateClientProfileUseCase } from "../../application/use-cases/client/profile/update-client-profile.use-case";

// repository import
import { ClientProfileRepository } from "../persistence/mongodb/repositories/client-profile.repository";
import { UserRepository } from "../persistence/mongodb/repositories/user.repository";






// repository init
const clientProfileRepository = new ClientProfileRepository()
const userRepository = new UserRepository()

//useCase init
const createClientProfileUseCase = new CreateClientProfileUseCase(clientProfileRepository)
const getClientProfileUseCase = new GetClientProfileUseCase(clientProfileRepository,userRepository)
const updateClientProfileUseCase = new UpdateClientProfileUseCase(clientProfileRepository,userRepository)

// controller inint
export const createClientProfileController = new CreateClientProfileController(createClientProfileUseCase)
export const getClientProfileController = new GetClientProfileController(getClientProfileUseCase)
export const updateClientProfileController = new UpdateClientProfileController(updateClientProfileUseCase)