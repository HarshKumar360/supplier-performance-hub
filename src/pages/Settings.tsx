import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Database, Mail } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-3xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-2">
              <Shield className="w-4 h-4" />
              Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-semibold text-foreground mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.smith@bp.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+44 20 7496 4000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="global-admin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global-admin">Global Admin</SelectItem>
                      <SelectItem value="regional-manager">Regional Manager</SelectItem>
                      <SelectItem value="supplier-manager">Supplier Manager</SelectItem>
                      <SelectItem value="site-manager">Site Manager</SelectItem>
                      <SelectItem value="bp-leadership">BP Leadership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-semibold text-foreground mb-6">Notification Preferences</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">SLA Breach Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Notify when supplier SLA drops below threshold
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Safety Incident Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Immediate notification for any safety incidents
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Cost Overrun Warnings</div>
                    <div className="text-sm text-muted-foreground">
                      Alert when costs exceed budget by 15%+
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">EV Charger Outages</div>
                    <div className="text-sm text-muted-foreground">
                      Notify for critical EV charger downtime
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Summary</div>
                    <div className="text-sm text-muted-foreground">
                      Receive weekly performance digest
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Monthly Scorecards</div>
                    <div className="text-sm text-muted-foreground">
                      Auto-send supplier scorecards
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h3 className="font-semibold text-foreground mb-6">Access Control</h3>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="font-medium mb-2">Current Role: Global Admin</div>
                  <div className="text-sm text-muted-foreground">
                    Full access to all suppliers, sites, and regions. Can manage users and
                    configure system settings.
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Assigned Regions</Label>
                  <div className="flex flex-wrap gap-2">
                    {["UK", "Germany", "Netherlands", "US", "ANZ", "South Africa"].map(
                      (region) => (
                        <span
                          key={region}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {region}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Data Access Level</Label>
                  <Select defaultValue="full">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="read-only">Read Only</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
