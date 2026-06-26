import { useState } from "react";
import { DollarSign, Users, UserCheck, ShoppingCart, Star, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGetAdminDashboardStatsQuery } from "@/hooks/admin/useGetAdminDashboardStatsQuery";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(210 38% 61%)" },
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const { data, isLoading } = useGetAdminDashboardStatsQuery(timeframe);

  const stats = data?.data;

  const mapStatus = (status: string) => {
    return status.toLowerCase().replace(/_/g, " ") as any;
  };

  const getCleanInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your marketplace performance</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <Button size="sm" className="gap-1.5">
            <ArrowUpRight className="h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
              change="Platform lifetime revenue"
              changeType="positive"
              icon={DollarSign}
            />
            <StatCard
              title="Active Providers"
              value={stats?.activeProviders?.toString() || "0"}
              change="Total approved providers"
              changeType="neutral"
              icon={UserCheck}
            />
            <StatCard
              title="Active Clients"
              value={stats?.activeClients?.toLocaleString() || "0"}
              change="Total registered clients"
              changeType="neutral"
              icon={Users}
            />
            <StatCard
              title="Pending Orders"
              value={stats?.pendingOrders?.toString() || "0"}
              change="Pending platform bookings"
              changeType="neutral"
              icon={ShoppingCart}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                    <CardDescription className="text-xs">Revenue trend (booking commissions & subscriptions)</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal capitalize">
                    {timeframe} trend
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {stats?.revenueOverview?.length ? (
                  <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <AreaChart data={stats.revenueOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(210 38% 61%)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="hsl(210 38% 61%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(v) => `₹${v}`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(210 38% 61%)" fill="url(#fillRevenue)" strokeWidth={2.5} />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                    No revenue trend data available for this timeframe
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Service Distribution</CardTitle>
                <CardDescription className="text-xs">By category share</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.serviceDistribution?.length ? (
                  <>
                    <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={stats.serviceDistribution} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                            {stats.serviceDistribution.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-2">
                      {stats.serviceDistribution.map((cat) => (
                        <div key={cat.name} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                              <span className="text-muted-foreground">{cat.name}</span>
                            </div>
                            <span className="font-medium text-foreground">{cat.value}%</span>
                          </div>
                          <Progress value={cat.value} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
                    No category data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentTransactions?.length ? (
                      stats.recentTransactions.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">{p.transactionId}</TableCell>
                          <TableCell className="font-medium text-sm">{p.clientName}</TableCell>
                          <TableCell className="font-semibold text-sm">₹{p.amount.toLocaleString()}</TableCell>
                          <TableCell><StatusBadge status={mapStatus(p.status)} /></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-6 text-sm text-muted-foreground">
                          No recent transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Top Providers</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats?.topProviders?.length ? (
                  stats.topProviders.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground w-4">#{i + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {p.avatar ? getCleanInitials(p.avatar) : getCleanInitials(p.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.completedJobs} jobs</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                        <span className="text-sm font-semibold">{p.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    No top providers found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}