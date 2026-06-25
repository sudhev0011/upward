import cron from "node-cron";

import { ILogger } from "../../domain/interfaces/services/ILogger";
import { IProcessProviderPayoutsUseCase } from "../../domain/interfaces/usecases/payment/IProcessProviderPayoutsUseCase";

export class ProviderPayoutJob {
  constructor(
    private readonly processProviderPayoutsUseCase: IProcessProviderPayoutsUseCase,

    private readonly logger: ILogger,
  ) {}

  start(): void {
    /**
     * Every hour
     */

    cron.schedule("0 * * * *", async () => {
      this.logger.info("[ProviderPayoutJob] Running...");

      try {
        const count = await this.processProviderPayoutsUseCase.execute();

        this.logger.info(
          `[ProviderPayoutJob] Released payouts for ${count} bookings`,
        );
      } catch (error) {
        this.logger.error("[ProviderPayoutJob] Failed:", error);
      }
    });
  }
}
