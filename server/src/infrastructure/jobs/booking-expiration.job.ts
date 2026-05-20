import cron from "node-cron";

import { IExpirePendingBookingsUseCase } from "../../domain/interfaces/usecases/booking/IExpirePendingBookingsUseCase";
import { ILogger } from "../../domain/interfaces/services/ILogger";

export class BookingExpirationJob {
  constructor(
    private readonly expirePendingBookingsUseCase: IExpirePendingBookingsUseCase,
    private readonly logger: ILogger
  ) {}

  start(): void {

    /**
     * Every minute
     */

    cron.schedule("* * * * *", async () => {

      this.logger.info(
        "[BookingExpirationJob] Running..."
      );

      try {

        await this.expirePendingBookingsUseCase.execute();

        this.logger.info(
          "[BookingExpirationJob] Completed"
        );

      } catch (error) {

        this.logger.error(
          "[BookingExpirationJob] Failed:",
          error
        );
      }
    });
  }
}