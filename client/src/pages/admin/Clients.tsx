import { useState } from "react";
import {
  MapPin, Phone, Mail, 
  ArrowUpDown, User, ShieldCheck, ShieldAlert,
  Clock, Info
} from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useGetClientProfileById } from "@/hooks/admin/useGetClientProfileById";
import { useGetClientsProfile } from "@/hooks/admin/useGetClientsProfiles";
import { useBlockClientMutation } from "@/hooks/admin/useBlockClient";
import { ClientProfile } from "@/interfaces/client/client.interface";

export default function Clients() {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    isBlocked: undefined as boolean | undefined,
  });

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data: listData } = useGetClientsProfile(params);

  const { data: clientResponse, isLoading: isDetailsLoading } = useGetClientProfileById(selectedClientId);

  const client = clientResponse?.data;

  const blockMutation = useBlockClientMutation()

  const columns = [
    {
      header: "Client",
      cell: (c: ClientProfile) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <img src={c.avatarUrl ?? ""} alt="" className="object-cover" />
            <AvatarFallback className="bg-primary/5 text-primary text-xs">
              {c.name?.[0] || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm leading-none mb-1">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (c: ClientProfile) => (
        <Badge variant={c.isVerified ? "default" : "secondary"} className="text-[10px] font-normal">
          {c.isVerified ? "Verified" : "Standard"}
        </Badge>
      ),
    },
    {
      header: "Account Control",
      cell: (c: ClientProfile) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={c.isBlocked}
            onCheckedChange={(checked) => blockMutation.mutate({ userId: c.userId, isBlocked: checked })}
            onClick={(e) => e.stopPropagation()}
          />
          <span className={`text-[11px] font-medium ${c.isBlocked ? 'text-destructive' : 'text-green-600'}`}>
            {c.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (c: ClientProfile) => (
        <span className="text-sm text-muted-foreground">
          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Client Directory</h1>
        <p className="text-sm text-muted-foreground">Manage service seekers and account permissions.</p>
      </div>

      <DataTable
        columns={columns}
        data={listData?.data?.clients || []} 
        rowKey={(c) => c.userId}
        onRowClick={(c) => setSelectedClientId(c.userId)}
        search={params.search}
        onSearchChange={(val) => setParams((prev) => ({ ...prev, search: val, page: 1 }))}
        filters={
          <div className="flex gap-2">
            <Select
              value={params.isBlocked === undefined ? "all" : String(params.isBlocked)}
              onValueChange={(val) =>
                setParams((p) => ({
                  ...p,
                  isBlocked: val === "all" ? undefined : val === "true",
                }))
              }
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="false">Active</SelectItem>
                <SelectItem value="true">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() =>
                setParams((p) => ({ ...p, sortOrder: p.sortOrder === "asc" ? "desc" : "asc" }))
              }
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* ─── CLIENT DETAILS DIALOG ─── */}
      <Dialog open={!!selectedClientId} onOpenChange={() => setSelectedClientId(null)}>
        <DialogContent className="sm:max-w-2xl overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed account overview for platform client</DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {isDetailsLoading ? (
              <div className="h-48 flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <p className="text-xs text-muted-foreground italic">Loading client data...</p>
              </div>
            ) : client ? (
              <>
                {/* Header Profile Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20 border-2 border-primary/10 shadow-sm">
                    <img src={client.avatarUrl ?? undefined} alt={client.name} className="object-cover" />
                    <AvatarFallback className="text-xl bg-muted">{client.name?.[0]}</AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{client.name}</h3>
                      {client.isVerified && (
                        <ShieldCheck className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <Badge variant={client.isBlocked ? "destructive" : "secondary"} className="font-normal">
                      {client.isBlocked ? "Account Blocked" : "Active Member"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Email Address</p>
                        <p className="text-sm font-medium">{client.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Phone Number</p>
                        <p className="text-sm font-medium">{client.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                        <p className="text-sm font-medium">{client.location || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Member Since</p>
                        <p className="text-sm font-medium">
                          {client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Actions Area */}
                <div className="mt-4 p-4 rounded-xl border bg-muted/30 border-dashed flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {client.isBlocked ? <ShieldAlert className="text-destructive h-5 w-5" /> : <Info className="text-primary h-5 w-5" />}
                    <div>
                      <p className="text-sm font-semibold">{client.isBlocked ? "Account Restricted" : "Standard Account"}</p>
                      <p className="text-xs text-muted-foreground">Modify user access permissions here.</p>
                    </div>
                  </div>
                  <Button 
                    variant={client.isBlocked ? "default" : "destructive"} 
                    size="sm"
                    onClick={() => blockMutation.mutate({ 
                      userId: client.userId, 
                      isBlocked: !client.isBlocked 
                    })}
                  >
                    {client.isBlocked ? "Unblock User" : "Suspend User"}
                  </Button>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => setSelectedClientId(null)}>Close</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-muted-foreground">User details could not be found.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}