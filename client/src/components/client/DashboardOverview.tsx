import { useState } from "react";
import { StatsRow } from "./StatsRow";
import { useGetClientDashboardStatsQuery } from "@/hooks/client/useGetClientDashboardStatsQuery";
import { useGetWallet } from "@/hooks/booking/use-get-wallet";
import { useListBookings } from "@/hooks/booking/use-list-bookings";
import { BookingDetailsSheet } from "@/components/booking-listing/BookingDetailsSheet";
import { BookingListItem } from "@/interfaces/bookings/bookings.interface";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppSelector } from "@/hooks/useRedux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Calendar,
  MessageSquare,
  Settings,
  Search,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [selectedBooking, setSelectedBooking] = useState<BookingListItem | null>(null);

  const { data: statsRes, isLoading: isStatsLoading } = useGetClientDashboardStatsQuery(timeframe);
  const { data: walletData, isLoading: isWalletLoading } = useGetWallet();
  const { data: bookingsRes, isLoading: isBookingsLoading } = useListBookings({
    page: 1,
    limit: 5,
    sortOrder: "desc",
  });

  const stats = statsRes?.data;
  const recentBookings = bookingsRes?.data || [];
  const walletTransactions = walletData?.transactions?.slice(0, 4) || [];

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200/60 shadow-none font-medium rounded-lg">
            Pending
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border border-blue-200/60 shadow-none font-medium rounded-lg">
            Confirmed
          </Badge>
        );
      case "COMPLETED":
      case "CLIENT_COMPLETED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200/60 shadow-none font-medium rounded-lg">
            Completed
          </Badge>
        );
      case "PROVIDER_COMPLETED":
        return (
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border border-indigo-200/60 shadow-none font-medium rounded-lg">
            Done (Provider)
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-rose-50 text-rose-700 hover:bg-rose-50 border border-rose-200/60 shadow-none font-medium rounded-lg">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-50 border border-gray-200/60 shadow-none font-medium rounded-lg">
            {status}
          </Badge>
        );
    }
  };

  const formatBookingDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name?: string, fallback = "P") => {
    return (
      name
        ?.split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || fallback
    );
  };

  const quickActions = [
    {
      label: "Find Services",
      description: "Search and book professional helpers",
      icon: Search,
      onClick: () => navigate("/"),
      bg: "hover:bg-[#EAF2F9]/50 hover:border-[#719FC4]/30",
      iconColor: "text-[#5585A8] bg-[#EAF2F9]",
    },
    {
      label: "My Bookings",
      description: "Track schedules and balances",
      icon: Calendar,
      onClick: () => navigate("/client/dashboard/bookings"),
      bg: "hover:bg-emerald-50/50 hover:border-emerald-200/50",
      iconColor: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Messages & Chat",
      description: "Connect with service providers",
      icon: MessageSquare,
      onClick: () => navigate("/client/dashboard/messages"),
      bg: "hover:bg-indigo-50/50 hover:border-indigo-200/50",
      iconColor: "text-indigo-600 bg-indigo-50",
    },
    {
      label: "Account Settings",
      description: "Update billing and settings",
      icon: Settings,
      onClick: () => navigate("/client/dashboard/settings"),
      bg: "hover:bg-amber-50/50 hover:border-amber-200/50",
      iconColor: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-[1400px] mx-auto w-full">
      {/* Welcome & Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#EAF2F9]/40 to-transparent p-6 rounded-2xl border border-gray-100 shadow-sm bg-white">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome back, {user?.name || "Client"}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Overview of your active schedules, wallet statements, and recent transactions.
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch md:self-auto justify-between border-t md:border-0 pt-3 md:pt-0">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Timeframe:</span>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[160px] bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-800">
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

      {isStatsLoading || isWalletLoading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-[#719FC4]" />
        </div>
      ) : (
        <>
          {/* Row 1 — Metric Cards */}
          <StatsRow stats={stats} walletBalance={walletData?.balance || 0} />

          {/* Grid Layout for details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Spending & Bookings */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Spending Graph */}
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white p-6">
                <CardHeader className="pb-4 p-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Spending Analytics</CardTitle>
                      <CardDescription className="text-xs text-gray-400">Track your booking payments over time</CardDescription>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-gray-400">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[280px] w-full p-0 mt-4">
                  {stats?.spendingOverview?.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.spendingOverview} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#719FC4" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#719FC4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" axisLine={false} tickLine={false} className="text-xs text-gray-400 font-medium" />
                        <YAxis axisLine={false} tickLine={false} className="text-xs text-gray-400 font-medium" tickFormatter={(v) => `₹${v}`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #F3F4F6", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                          formatter={(value) => [`₹${value}`, "Spent"]}
                        />
                        <Area type="monotone" dataKey="spent" stroke="#719FC4" fill="url(#fillSpent)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      No spending trend data available for this timeframe
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Bookings Feed */}
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white p-6">
                <CardHeader className="pb-4 p-0 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Recent Bookings</CardTitle>
                    <CardDescription className="text-xs text-gray-400">View and manage your active orders</CardDescription>
                  </div>
                  <button
                    onClick={() => navigate("/client/dashboard/bookings")}
                    className="text-xs font-semibold text-[#5585A8] hover:text-[#719FC4] transition-colors flex items-center gap-1 group"
                  >
                    View All
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  {isBookingsLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-[#719FC4]" />
                    </div>
                  ) : recentBookings.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center justify-between py-3.5 hover:bg-slate-50/50 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                              <AvatarImage
                                src={
                                  booking.provider.avatarFileName
                                    ? `/uploads/avatars/${booking.provider.avatarFileName}`
                                    : ""
                                }
                              />
                              <AvatarFallback className="bg-[#EAF2F9] text-[#5585A8] font-bold text-sm">
                                {getInitials(booking.provider.name, "P")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-950 truncate group-hover:text-[#5585A8] transition-colors">
                                {booking.service?.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                                <span className="font-medium text-gray-600 truncate">{booking.provider?.name}</span>
                                <span>•</span>
                                <span>{formatBookingDate(booking.bookingDate)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-extrabold text-gray-950">₹{booking.totalAmount}</p>
                              <p className="text-[10px] font-semibold text-gray-400 capitalize mt-0.5">
                                {booking.paymentStatus.toLowerCase()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(booking.status)}
                              <ArrowRight className="h-4 w-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-gray-500 transition-all duration-200" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-100 rounded-xl bg-slate-50/30">
                      <Clock className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm font-medium text-gray-400">No bookings found</p>
                      <button
                        onClick={() => navigate("/")}
                        className="mt-3 text-xs font-semibold text-[#5585A8] hover:underline"
                      >
                        Create a Booking now
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Wallet & Quick Actions */}
            <div className="flex flex-col gap-6">
              
              {/* Wallet Summary */}
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white overflow-hidden">
                <div className="bg-gradient-to-br from-[#719FC4] to-[#5585A8] p-6 text-white relative">
                  <div className="absolute right-4 top-4 opacity-15">
                    <CreditCard className="h-24 w-24 stroke-[1.5]" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Wallet Balance</p>
                  <h3 className="text-3xl font-extrabold tracking-tight mt-1">
                    ₹{(walletData?.balance || 0).toLocaleString()}
                  </h3>
                  <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs">
                    <span className="text-white/80 font-medium">Status Active</span>
                    <button
                      onClick={() => navigate("/client/dashboard/payments")}
                      className="bg-white/20 hover:bg-white/35 transition-colors px-2.5 py-1 rounded-lg font-bold flex items-center gap-1"
                    >
                      Payments
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Recent Wallet Activity
                  </h4>
                  {walletTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {walletTransactions.map((tx) => {
                        const isCredit = tx.type === "credit";
                        return (
                          <div key={tx.id} className="flex justify-between items-center text-xs">
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate">{tx.description}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-3">
                              {isCredit ? (
                                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                              )}
                              <span className={`font-bold ${isCredit ? "text-emerald-600" : "text-gray-900"}`}>
                                {isCredit ? "+" : "-"}₹{Math.abs(tx.amount)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">No recent wallet activity</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions Hub */}
              <Card className="border border-gray-100 shadow-sm rounded-2xl bg-white p-6">
                <CardHeader className="pb-4 p-0">
                  <CardTitle className="text-lg font-bold text-gray-900">Quick Actions</CardTitle>
                  <CardDescription className="text-xs text-gray-400">Shortcuts to manage your account</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                  <div className="grid grid-cols-1 gap-3">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={action.onClick}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-white transition-all text-left group ${action.bg}`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 ${action.iconColor}`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-gray-950 group-hover:text-gray-900 transition-colors">
                              {action.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {action.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      )}

      {/* Booking Details Dialog Drawer */}
      <BookingDetailsSheet
        booking={selectedBooking}
        role="client"
        open={!!selectedBooking}
        onOpenChange={(open) => !open && setSelectedBooking(null)}
      />
    </div>
  );
};