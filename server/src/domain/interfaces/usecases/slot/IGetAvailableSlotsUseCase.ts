import { GetAvailableSlotsRequestDto } from "../../../../application/dtos/provider/slot/get-available-slots-request.dto";

export interface IGetAvailableSlotsUseCase {
  execute(input: GetAvailableSlotsRequestDto): Promise<
    {
      startTime: string;
      endTime: string;
    }[]
  >;
}