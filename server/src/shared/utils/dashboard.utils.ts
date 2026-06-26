export function getStartDateForTimeframe(timeframe: string): Date {
  const now = new Date();
  switch (timeframe?.toLowerCase()) {
    case "daily":
    case "today": {
      const date = new Date(now);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    case "weekly": {
      const date = new Date(now);
      date.setDate(now.getDate() - 7);
      return date;
    }
    case "monthly": {
      const date = new Date(now);
      date.setMonth(now.getMonth() - 1);
      return date;
    }
    case "quarterly": {
      const date = new Date(now);
      date.setMonth(now.getMonth() - 3);
      return date;
    }
    case "half-year":
    case "half_year":
    case "halfyear": {
      const date = new Date(now);
      date.setMonth(now.getMonth() - 6);
      return date;
    }
    case "yearly": {
      const date = new Date(now);
      date.setFullYear(now.getFullYear() - 1);
      return date;
    }
    case "all":
    case "all-time":
    default:
      return new Date(0); // All time
  }
}

export function getGroupingForTimeframe(timeframe: string): "hour" | "day" | "week" | "month" {
  switch (timeframe?.toLowerCase()) {
    case "daily":
    case "today":
      return "hour";
    case "weekly":
      return "day";
    case "monthly":
      return "day";
    case "quarterly":
      return "week";
    case "half-year":
    case "half_year":
    case "halfyear":
      return "month";
    case "yearly":
    case "all":
    case "all-time":
    default:
      return "month";
  }
}
