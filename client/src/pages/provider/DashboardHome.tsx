import {
  ShoppingCart,
  DollarSign,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

const recentOrders = [
  {
    id: "ORD-001",
    client: "Sarah Johnson",
    service: "Wedding Photography",
    date: "Mar 15, 2026",
    amount: "$2,500",
    status: "active" as const,
  },
  {
    id: "ORD-002",
    client: "Mike Chen",
    service: "Video Editing",
    date: "Mar 12, 2026",
    amount: "$800",
    status: "completed" as const,
  },
  {
    id: "ORD-003",
    client: "Emily Davis",
    service: "Social Media Package",
    date: "Mar 10, 2026",
    amount: "$1,200",
    status: "pending" as const,
  },
  {
    id: "ORD-004",
    client: "James Wilson",
    service: "Product Photography",
    date: "Mar 8, 2026",
    amount: "$650",
    status: "completed" as const,
  },
];

const upcomingBookings = [
  {
    client: "Lisa Park",
    service: "Corporate Event",
    date: "Mar 20, 2026",
    time: "10:00 AM",
  },
  {
    client: "Tom Richards",
    service: "Portrait Session",
    date: "Mar 22, 2026",
    time: "2:00 PM",
  },
  {
    client: "Anna Bell",
    service: "Real Estate Shoot",
    date: "Mar 25, 2026",
    time: "9:00 AM",
  },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back, Alex 👋
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value="156"
          change="+12% from last month"
          changeType="positive"
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Earnings"
          value="$24,580"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Profile Views"
          value="1,247"
          change="+23% from last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Upcoming Bookings"
          value="8"
          change="3 this week"
          changeType="neutral"
          icon={CalendarDays}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground text-base">
              Recent Orders
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/20 p-4 hover:bg-secondary/30 transition-colors duration-200"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-card-foreground">
                      {order.client}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.service} · {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-card-foreground">
                      {order.amount}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground text-base">
              Upcoming Bookings
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              View all <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBookings.map((booking, i) => (
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
                      {booking.date}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
