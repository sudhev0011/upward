import { DollarSign, Users, UserCheck, ShoppingCart, Star, ArrowUpRight } from "lucide-react";
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
import {
  providers,
  payments,
  revenueData,
  categoryDistribution,
  dashboardStats,
} from "@/data/adminData";

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(210 38% 61%)" },
};

export default function Dashboard() {
  const topProviders = [...providers].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your marketplace performance</p>
        </div>
        <Button size="sm" className="gap-1.5">
          <ArrowUpRight className="h-4 w-4" />
          View Reports
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${(dashboardStats.totalRevenue / 1000).toFixed(1)}K`}
          change={dashboardStats.revenueGrowth}
          icon={DollarSign}
        />
        <StatCard
          title="Active Providers"
          value={dashboardStats.activeProviders.toString()}
          change={dashboardStats.providerGrowth}
          icon={UserCheck}
        />
        <StatCard
          title="Active Clients"
          value={dashboardStats.activeClients.toLocaleString()}
          change={dashboardStats.clientGrowth}
          icon={Users}
        />
        <StatCard
          title="Pending Orders"
          value={dashboardStats.pendingOrders.toString()}
          change={dashboardStats.orderGrowth}
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
                <CardDescription className="text-xs">Monthly revenue trend</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs font-normal">Last 12 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(210 38% 61%)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="hsl(210 38% 61%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" tickFormatter={(v) => `$${v / 1000}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(210 38% 61%)" fill="url(#fillRevenue)" strokeWidth={2.5} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Service Distribution</CardTitle>
            <CardDescription className="text-xs">By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryDistribution} innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {categoryDistribution.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-2">
              {categoryDistribution.map((cat) => (
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
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
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
                {recentPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.transactionId}</TableCell>
                    <TableCell className="font-medium text-sm">{p.clientName}</TableCell>
                    <TableCell className="font-semibold text-sm">${p.amount}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Top Providers</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProviders.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-4">#{i + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">{p.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.completedJobs} jobs</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="text-sm font-semibold">{p.rating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}