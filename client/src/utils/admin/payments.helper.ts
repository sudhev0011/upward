/**
 * Shared display helpers for the admin Payments page and its sub-components.
 */

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Maps a raw payment/transaction status onto the variant StatusBadge expects.
export function mapPaymentStatusForBadge(status: string) {
  const s = status.toLowerCase();
  if (s === "succeeded") return "completed";
  return s as any;
}

// Maps a raw payout-request status onto the variant StatusBadge expects.
export function getPayoutRequestStatusVariant(status: string) {
  switch (status) {
    case "pending":
      return "pending";
    case "transferred":
      return "completed";
    case "rejected":
      return "cancelled";
    default:
      return "inactive";
  }
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}