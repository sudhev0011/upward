import { useState } from "react";
import {
  ShoppingCart,
  DollarSign,
  CalendarDays,
  Loader2,
  Wallet,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { useGetProviderDashboardStatsQuery } from "@/hooks/provider/useGetProviderDashboardStatsQuery";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardHome() {
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const { data, isLoading } = useGetProviderDashboardStatsQuery(timeframe);

  const stats = data?.data;

  const mapStatus = (status: string) => {
    const normalized = status.toLowerCase().replace(/_/g, " ");
    if (normalized === "confirmed") return "active";
    return normalized as any;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeframe:</span>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-card border border-border rounded-xl shadow-sm text-sm text-foreground">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-border shadow-lg rounded-xl">
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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={stats?.totalOrders?.toString() || "0"}
              change="Total bookings received"
              changeType="neutral"
              icon={ShoppingCart}
            />
            <StatCard
              title="Total Earnings"
              value={`₹${(stats?.totalEarnings || 0).toLocaleString()}`}
              change="Platform lifetime earnings"
              changeType="positive"
              icon={DollarSign}
            />
            <StatCard
              title="Wallet Balance"
              value={`₹${(stats?.walletBalance || 0).toLocaleString()}`}
              change="Withdrawable wallet balance"
              changeType="positive"
              icon={Wallet}
            />
            <StatCard
              title="Upcoming Bookings"
              value={stats?.upcomingBookingsCount?.toString() || "0"}
              change="Confirmed bookings remaining"
              changeType="neutral"
              icon={CalendarDays}
            />
          </div>

          {/* Earnings Overview Area Chart */}
          <Card className="border border-border/50 bg-card/80 backdrop-blur-sm p-6">
            <CardHeader className="pb-4 p-0">
              <CardTitle className="text-card-foreground text-base font-bold">Earnings Overview</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Your earnings trend over the selected timeframe</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px] w-full p-0 mt-4">
              {stats?.earningsOverview?.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.earningsOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fillEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs text-muted-foreground" />
                    <YAxis axisLine={false} tickLine={false} className="text-xs text-muted-foreground" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip formatter={(value) => [`₹${value}`, "Earnings"]} />
                    <Area type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" fill="url(#fillEarnings)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No earnings trend data available for this timeframe
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Grid for Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-card-foreground text-base">
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentOrders?.length ? (
                    stats.recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-4 hover:bg-secondary/30 transition-colors duration-200"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-card-foreground">
                            {order.client}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.service} · {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-card-foreground">
                            ₹{order.amount.toLocaleString()}
                          </span>
                          <StatusBadge status={mapStatus(order.status)} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No recent orders found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-card-foreground text-base">
                  Upcoming Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.upcomingBookings?.length ? (
                    stats.upcomingBookings.map((booking, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 rounded-xl border border-border/50 bg-secondary/20 p-4 hover:bg-secondary/30 transition-colors duration-200"
                      >
                        <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-card-foreground">
                            {booking.client}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.service}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-card-foreground">
                            {formatDate(booking.date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      No upcoming bookings scheduled
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
