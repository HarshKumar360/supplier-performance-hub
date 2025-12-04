import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { sites, workOrders, suppliers, kpis } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Gauge,
  Package,
} from "lucide-react";

export default function SiteDashboard() {
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [search, setSearch] = useState("");

  const siteWOs = workOrders.filter((wo) => wo.siteId === selectedSite.id);
  const openWOs = siteWOs.filter((wo) => wo.status !== "Closed").length;
  const overdueWOs = siteWOs.filter((wo) => wo.status === "Overdue").length;
  const evOutages = siteWOs.filter(
    (wo) => wo.assetType === "EV Charger" && wo.status !== "Closed"
  ).length;

  // Get unique suppliers for this site
  const siteSupplierIds = [...new Set(siteWOs.map((wo) => wo.supplierId))];
  const siteSuppliers = suppliers.filter((s) => siteSupplierIds.includes(s.id));

  // Calculate site uptime (mock)
  const siteUptime = 100 - Math.min(overdueWOs * 5, 30);

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Site Dashboard"
      subtitle={`${selectedSite.name} • ${selectedSite.country}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Site Selector */}
          <div className="bg-card rounded-xl border border-border/50 p-5">
            <h3 className="font-semibold text-foreground mb-4">Select Site</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedSite.id === site.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className="font-medium text-sm">{site.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3" />
                    {site.country}
                    <span className="ml-auto">{site.assetCount} assets</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Site Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Site Info Card */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedSite.name}</h2>
                    <RAGBadge
                      status={overdueWOs > 3 ? "red" : overdueWOs > 0 ? "amber" : "green"}
                    />
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedSite.country}, {selectedSite.region}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-muted text-xs">
                      {selectedSite.siteType}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{siteUptime}%</div>
                  <div className="text-sm text-muted-foreground">Site Uptime</div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KPICard
                title="Total Assets"
                value={selectedSite.assetCount}
                icon={Package}
              />
              <KPICard
                title="Open Work Orders"
                value={openWOs}
                icon={CheckCircle2}
                status={openWOs > 10 ? "red" : openWOs > 5 ? "amber" : "green"}
              />
              <KPICard
                title="EV Charger Outages"
                value={evOutages}
                icon={Zap}
                status={evOutages > 2 ? "red" : evOutages > 0 ? "amber" : "green"}
              />
              <KPICard
                title="Overdue Tasks"
                value={overdueWOs}
                icon={AlertTriangle}
                status={overdueWOs > 3 ? "red" : overdueWOs > 0 ? "amber" : "green"}
              />
            </div>

            {/* Suppliers at Site */}
            <div className="bg-card rounded-xl border border-border/50 p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Suppliers at This Site ({siteSuppliers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {siteSuppliers.map((supplier) => {
                  const supplierWOs = siteWOs.filter((wo) => wo.supplierId === supplier.id);
                  const closedWOs = supplierWOs.filter((wo) => wo.status === "Closed").length;
                  const completionRate = supplierWOs.length > 0
                    ? Math.round((closedWOs / supplierWOs.length) * 100)
                    : 0;

                  return (
                    <div
                      key={supplier.id}
                      className="p-4 rounded-lg border border-border/50 bg-background"
                    >
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {supplier.serviceCategory}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Work Orders</span>
                        <span className="font-medium">{supplierWOs.length}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Completion Rate</span>
                        <span
                          className={
                            completionRate >= 80
                              ? "text-rag-green"
                              : completionRate >= 60
                              ? "text-rag-amber"
                              : "text-rag-red"
                          }
                        >
                          {completionRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Work Orders Table */}
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Work Orders at This Site</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr className="bg-muted/30">
                      <th>WO ID</th>
                      <th>Supplier</th>
                      <th>Category</th>
                      <th>Asset Type</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th className="text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteWOs.slice(0, 10).map((wo) => {
                      const supplier = suppliers.find((s) => s.id === wo.supplierId);
                      return (
                        <tr key={wo.id}>
                          <td className="font-medium">{wo.id}</td>
                          <td>{supplier?.name}</td>
                          <td>{wo.category}</td>
                          <td>{wo.assetType}</td>
                          <td>
                            <RAGBadge
                              status={
                                wo.status === "Closed"
                                  ? "green"
                                  : wo.status === "Overdue"
                                  ? "red"
                                  : "amber"
                              }
                              label={wo.status}
                              size="sm"
                            />
                          </td>
                          <td>{wo.startDate}</td>
                          <td className="text-right">£{wo.cost.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
