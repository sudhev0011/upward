import { NotFoundError } from "../../../../domain/errors/errors";
import { IProviderServiceRepository } from "../../../../domain/interfaces/repositories/provider/IProviderServiceRepository";
import { IDeleteProviderServiceUseCase } from "../../../../domain/interfaces/usecases/provider/providerService/IDeleteProviderServiceUseCase";

export class DeleteProviderServiceUseCase implements IDeleteProviderServiceUseCase {

    constructor(
        private readonly _providerServiceRepository: IProviderServiceRepository,
    ){}
    execute(id: string): Promise<boolean> {

        const result = this._providerServiceRepository.delete(id);

        if(!result){
            throw new NotFoundError();
        }

        return result;
        
    }
}