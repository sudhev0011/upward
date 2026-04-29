export interface IDeleteServiceUseCase{
    execute(data: {serviceId: string; userId: string}): Promise<void>
}