import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Eye,
  MapPin,
  CreditCard,
  FileText,
  Briefcase,
  Calendar,
  User,
  IndianRupee,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type OrderStatus = "active" | "pending" | "completed" | "cancelled";

interface Order {
  id: string;
  client: string;
  service: string;
  category: string;
  date: string;
  amount: string;
  status: OrderStatus;
  location: string;
  phone: string;
  email: string;
  paymentMethod: string;
  paymentStatus: string;
  requirements: string;
  eventDate: string;
  duration: string;
}

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    client: "Sarah Johnson",
    service: "Wedding Photography",
    category: "Photography",
    date: "Mar 15, 2026",
    amount: "$2,500",
    status: "active",
    location: "Grand Ballroom, Taj Palace, Mumbai",
    phone: "+91 98765 43210",
    email: "sarah@email.com",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    requirements:
      "Need candid shots, drone coverage for outdoor ceremony, and a highlight reel. Prefer natural lighting style.",
    eventDate: "Mar 20, 2026",
    duration: "8 hours",
  },
  {
    id: "ORD-002",
    client: "Mike Chen",
    service: "Video Editing",
    category: "Editing",
    date: "Mar 12, 2026",
    amount: "$800",
    status: "completed",
    location: "Remote",
    phone: "+91 87654 32109",
    email: "mike@email.com",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    requirements:
      "Edit 2-hour raw footage into a 10-min cinematic video with color grading and background music.",
    eventDate: "Mar 14, 2026",
    duration: "3 days",
  },
  {
    id: "ORD-003",
    client: "Emily Davis",
    service: "Social Media Package",
    category: "Social Media",
    date: "Mar 10, 2026",
    amount: "$1,200",
    status: "pending",
    location: "Studio 5, Andheri West, Mumbai",
    phone: "+91 76543 21098",
    email: "emily@email.com",
    paymentMethod: "Credit Card",
    paymentStatus: "Pending",
    requirements:
      "30 reels + 15 posts for Instagram. Brand colors: teal & gold. Need content calendar first.",
    eventDate: "Mar 15–Apr 15, 2026",
    duration: "1 month",
  },
  {
    id: "ORD-004",
    client: "James Wilson",
    service: "Product Photography",
    category: "Photography",
    date: "Mar 8, 2026",
    amount: "$650",
    status: "completed",
    location: "Client's warehouse, Pune",
    phone: "+91 65432 10987",
    email: "james@email.com",
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    requirements:
      "White background product shots for 25 items. Need both lifestyle and isolated shots.",
    eventDate: "Mar 10, 2026",
    duration: "4 hours",
  },
  {
    id: "ORD-005",
    client: "Rachel Green",
    service: "Event Videography",
    category: "Videography",
    date: "Mar 5, 2026",
    amount: "$1,800",
    status: "completed",
    location: "Convention Center, Bangalore",
    phone: "+91 54321 09876",
    email: "rachel@email.com",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Paid",
    requirements:
      "Full event coverage with 2 cameras, live streaming setup, and same-day highlight video.",
    eventDate: "Mar 7, 2026",
    duration: "6 hours",
  },
  {
    id: "ORD-006",
    client: "David Brown",
    service: "Portrait Session",
    category: "Photography",
    date: "Mar 3, 2026",
    amount: "$350",
    status: "cancelled",
    location: "Cubbon Park, Bangalore",
    phone: "+91 43210 98765",
    email: "david@email.com",
    paymentMethod: "UPI",
    paymentStatus: "Refunded",
    requirements:
      "Outdoor portrait session, casual and formal looks. Bring props if possible.",
    eventDate: "Mar 5, 2026",
    duration: "2 hours",
  },
  {
    id: "ORD-007",
    client: "Sophie Turner",
    service: "Brand Photography",
    category: "Photography",
    date: "Mar 1, 2026",
    amount: "$900",
    status: "active",
    location: "Office, Koramangala, Bangalore",
    phone: "+91 32109 87654",
    email: "sophie@email.com",
    paymentMethod: "Credit Card",
    paymentStatus: "50% Advance Paid",
    requirements:
      "Team headshots (15 people) + office environment shots for website rebrand.",
    eventDate: "Mar 4, 2026",
    duration: "5 hours",
  },
  {
    id: "ORD-008",
    client: "Chris Martin",
    service: "Drone Footage",
    category: "Videography",
    date: "Feb 28, 2026",
    amount: "$1,100",
    status: "pending",
    location: "Farmhouse, Lonavala",
    phone: "+91 21098 76543",
    email: "chris@email.com",
    paymentMethod: "Bank Transfer",
    paymentStatus: "Pending",
    requirements:
      "Aerial footage of the property for real estate listing. Need 4K resolution, multiple angles.",
    eventDate: "Mar 2, 2026",
    duration: "3 hours",
  },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(
    (o) =>
      (filter === "all" || o.status === filter) &&
      (o.client.toLowerCase().includes(search.toLowerCase()) ||
        o.service.toLowerCase().includes(search.toLowerCase())),
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : null,
      );
    }
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Manage and track all your orders.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9 bg-secondary/30 border-border/50 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {["all", "active", "pending", "completed", "cancelled"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(f)}
              className={`capitalize rounded-xl text-xs ${filter === f ? "shadow-lg shadow-primary/20" : ""}`}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Client
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-border/30 last:border-0 hover:bg-secondary/20 transition-colors duration-200"
                  >
                    <td className="p-4 text-sm font-mono text-muted-foreground">
                      {order.id}
                    </td>
                    <td className="p-4 text-sm font-medium text-card-foreground">
                      {order.client}
                    </td>
                    <td className="p-4 text-sm text-card-foreground">
                      {order.service}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {order.date}
                    </td>
                    <td className="p-4 text-sm font-bold text-card-foreground">
                      {order.amount}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-primary/10"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      >
        <DialogContent className="sm:max-w-2xl bg-card border-border/50 max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between pr-6">
                  <div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {selectedOrder.id}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on {selectedOrder.date}
                    </p>
                  </div>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </DialogHeader>

              <Separator className="bg-border/50" />

              {/* Client Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {selectedOrder.client}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {selectedOrder.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Service Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {selectedOrder.service}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedOrder.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Event Date & Duration
                      </p>
                      <p className="text-sm font-medium text-card-foreground">
                        {selectedOrder.eventDate}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedOrder.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Requirements */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Client
                  Requirements
                </h3>
                <div className="bg-secondary/30 rounded-xl p-4 border border-border/30">
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {selectedOrder.requirements}
                  </p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Payment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment
                  Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-card-foreground mt-1">
                      {selectedOrder.amount}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
                    <p className="text-xs text-muted-foreground">Method</p>
                    <p className="text-sm font-semibold text-card-foreground mt-1">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 text-center">
                    <p className="text-xs text-muted-foreground">
                      Payment Status
                    </p>
                    <p className="text-sm font-semibold text-card-foreground mt-1">
                      {selectedOrder.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Status Toggle */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Update Status
                </h3>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) =>
                    handleStatusChange(selectedOrder.id, val as OrderStatus)
                  }
                >
                  <SelectTrigger className="w-full sm:w-56 bg-secondary/30 border-border/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/50">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
