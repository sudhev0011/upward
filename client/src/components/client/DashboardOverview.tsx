import { useState } from "react";
import { StatsRow } from "./StatsRow";
import { BookingsTable } from "./BookingsTable";
import { useGetClientDashboardStatsQuery } from "@/hooks/client/useGetClientDashboardStatsQuery";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export const DashboardOverview = () => {
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const { data, isLoading } = useGetClientDashboardStatsQuery(timeframe);

  const stats = data?.data;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your activity and bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeframe:</span>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-800">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-100 shadow-lg rounded-xl">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="half-year">Half Year</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          {/* Row 2 — Stats */}
          <StatsRow stats={stats} />

          {/* Row 2.5 — Spending Trend Chart */}
          <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white p-6">
            <CardHeader className="pb-4 p-0">
              <CardTitle className="text-lg font-bold text-gray-900">Spending Overview</CardTitle>
              <CardDescription className="text-xs text-gray-400">Your total booking spent over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px] w-full p-0 mt-4">
              {stats?.spendingOverview?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.spendingOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs text-gray-400" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-400" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(value) => [`₹${value}`, "Spent"]} />
                    <Area type="monotone" dataKey="spent" stroke="#4F46E5" fill="url(#fillSpent)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No spending trend data available for this timeframe
                </div>
              )}
            </CardContent>
          </Card>

          {/* Row 3 — Bookings (full width) */}
          <BookingsTable />
        </>
      )}
    </div>
  );
};