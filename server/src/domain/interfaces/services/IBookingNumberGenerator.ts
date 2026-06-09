export interface IBookingIdGenerator {
  generate(): Promise<string>;
}