import cron from "node-cron";

import { IExpireStalePendingSubscriptionsUseCase } from "../../domain/interfaces/usecases/subscription/IExpireStalePendingSubscriptionsUseCase";
import { ILogger } from "../../domain/interfaces/services/ILogger";

export class ExpirePendingSubscriptionsJob {
  constructor(
    private readonly expireStalePendingSubscriptionsUseCase: IExpireStalePendingSubscriptionsUseCase,
    private readonly logger: ILogger,
  ) {}

  start(): void {

    /**
     * Every 15 minutes
     */

    cron.schedule("*/15 * * * *", async () => {

      this.logger.info(
        "[ExpirePendingSubscriptionsJob] Running..."
      );

      try {

        const count = await this.expireStalePendingSubscriptionsUseCase.execute(30);

        this.logger.info(
          `[ExpirePendingSubscriptionsJob] Completed, expired ${count} subscriptions`
        );

      } catch (error) {

        this.logger.error(
          "[ExpirePendingSubscriptionsJob] Failed:",
          error
        );
      }
    });
  }
}