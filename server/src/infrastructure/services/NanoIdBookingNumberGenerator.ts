import { customAlphabet } from "nanoid";
import { IBookingIdGenerator } from "../../domain/interfaces/services/IBookingNumberGenerator";


const nanoid = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  8,
);

export class NanoIdBookingIdtor
  implements IBookingIdGenerator
{
  async generate(): Promise<string> {
    return `BK-${nanoid()}`;
  }
}