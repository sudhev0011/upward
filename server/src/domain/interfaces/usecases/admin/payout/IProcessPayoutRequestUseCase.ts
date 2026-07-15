export interface IProcessPayoutRequestUseCase {
  execute(
    requestId: string,
    status: "transferred" | "rejected",
    adminNotes?: string
  ): Promise<void>;
}
