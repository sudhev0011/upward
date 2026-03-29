import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Bell, Lock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1.5">Manage your account preferences.</p>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {[
            { label: "Email notifications", desc: "Receive order updates via email", defaultChecked: true },
            { label: "SMS notifications", desc: "Get text alerts for new bookings", defaultChecked: false },
            { label: "Push notifications", desc: "Browser push for messages", defaultChecked: true },
            { label: "Marketing emails", desc: "Tips, updates and promotions", defaultChecked: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-1 rounded-xl hover:bg-secondary/20 transition-colors duration-200">
              <div>
                <p className="text-sm font-semibold text-card-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-card-foreground text-base flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</Label>
              <Input type="password" className="bg-secondary/30 border-border/50 rounded-xl" />
            </div>
            <div />
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</Label>
              <Input type="password" className="bg-secondary/30 border-border/50 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm New Password</Label>
              <Input type="password" className="bg-secondary/30 border-border/50 rounded-xl" />
            </div>
          </div>
          <Button className="rounded-xl shadow-lg shadow-primary/20" onClick={() => toast.success("Password updated!")}>Update Password</Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-destructive text-base flex items-center gap-2">
            <Trash2 className="h-5 w-5" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back.</p>
          <Button variant="destructive" className="rounded-xl">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
