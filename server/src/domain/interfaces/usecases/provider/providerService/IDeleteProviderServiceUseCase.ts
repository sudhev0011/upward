export interface IDeleteProviderServiceUseCase {
    execute(id:string):Promise<boolean>
}