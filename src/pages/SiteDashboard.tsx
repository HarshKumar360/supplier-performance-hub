import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { sites, workOrders, suppliers, kpis } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Search,
  MapPin,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Building2,
  Activity,
} from "lucide-react";

export default function SiteDashboard() {
  const navigate = useNavigate();
  const [selectedSite, setSelectedSite] = useState(sites[0]);
  const [search, setSearch] = useState("");

  const siteWOs = workOrders.filter((wo) => wo.siteId === selectedSite.id);
  const openWOs = siteWOs.filter((wo) => wo.status !== "Closed").length;
  const overdueWOs = siteWOs.filter((wo) => wo.status === "Overdue").length;
  const delayedWOs = siteWOs.filter((wo) => wo.status === "Delayed").length;
  const closedWOs = siteWOs.filter((wo) => wo.status === "Closed").length;
  const evOutages = siteWOs.filter(
    (wo) => wo.assetType === "EV Charger" && wo.status !== "Closed"
  ).length;

  // Get unique suppliers for this site
  const siteSupplierIds = [...new Set(siteWOs.map((wo) => wo.supplierId))];
  const siteSuppliers = suppliers.filter((s) => siteSupplierIds.includes(s.id));

  // Calculate site metrics
  const siteUptime = 100 - Math.min(overdueWOs * 5, 30);
  const avgResponseTime = siteWOs.length > 0 
    ? Math.round(siteWOs.reduce((sum, wo) => sum + wo.responseTimeHours, 0) / siteWOs.length)
    : 0;
  const totalCost = siteWOs.reduce((sum, wo) => sum + wo.cost, 0);
  const avgCostPerWO = siteWOs.length > 0 ? Math.round(totalCost / siteWOs.length) : 0;

  // Work order status distribution
  const woStatusData = [
    { name: "Open", value: siteWOs.filter(wo => wo.status === "Open").length, fill: "hsl(var(--chart-3))" },
    { name: "Closed", value: closedWOs, fill: "hsl(var(--rag-green))" },
    { name: "Delayed", value: delayedWOs, fill: "hsl(var(--rag-amber))" },
    { name: "Overdue", value: overdueWOs, fill: "hsl(var(--rag-red))" },
  ];

  // Asset type distribution
  const assetTypeData = siteWOs.reduce((acc, wo) => {
    acc[wo.assetType] = (acc[wo.assetType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const assetChartData = Object.entries(assetTypeData).map(([name, value]) => ({
    name: name.length > 8 ? name.slice(0, 8) + "..." : name,
    count: value,
  }));

  // Category distribution
  const categoryData = siteWOs.reduce((acc, wo) => {
    acc[wo.category] = (acc[wo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(search.toLowerCase()) ||
    site.country.toLowerCase().includes(search.toLowerCase())
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
            <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
              {filteredSites.map((site) => {
                const siteWOCount = workOrders.filter(wo => wo.siteId === site.id && wo.status !== "Closed").length;
                return (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedSite.id === site.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{site.name}</div>
                      {siteWOCount > 5 && (
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-rag-amber/20 text-rag-amber">
                          {siteWOCount} open
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3" />
                      {site.country}
                      <span className="ml-auto">{site.assetCount} assets</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {site.siteType}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Site Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Site Info Card */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {selectedSite.assetCount} assets
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{siteUptime}%</div>
                    <div className="text-sm text-muted-foreground">Site Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">{siteWOs.length}</div>
                    <div className="text-sm text-muted-foreground">Total WOs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <KPICard
                title="Total Assets"
                value={selectedSite.assetCount}
                icon={Package}
              />
              <KPICard
                title="Open WOs"
                value={openWOs}
                icon={CheckCircle2}
                status={openWOs > 10 ? "red" : openWOs > 5 ? "amber" : "green"}
              />
              <KPICard
                title="EV Outages"
                value={evOutages}
                icon={Zap}
                status={evOutages > 2 ? "red" : evOutages > 0 ? "amber" : "green"}
              />
              <KPICard
                title="Overdue"
                value={overdueWOs}
                icon={AlertTriangle}
                status={overdueWOs > 3 ? "red" : overdueWOs > 0 ? "amber" : "green"}
              />
              <KPICard
                title="Avg Response"
                value={`${avgResponseTime}h`}
                icon={Clock}
                status={avgResponseTime > 12 ? "red" : avgResponseTime > 8 ? "amber" : "green"}
              />
              <KPICard
                title="Total Cost"
                value={`£${(totalCost / 1000).toFixed(1)}k`}
                icon={DollarSign}
              />
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                <TabsTrigger value="workorders">Work Orders</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WO Status Distribution */}
                  <div className="chart-container">
                    <h3 className="font-semibold text-foreground mb-4">Work Order Status</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={woStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {woStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Distribution */}
                  <div className="chart-container">
                    <h3 className="font-semibold text-foreground mb-4">Work by Category</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {categoryChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Asset Type Distribution */}
                <div className="chart-container">
                  <h3 className="font-semibold text-foreground mb-4">Work Orders by Asset Type</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={assetChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suppliers" className="space-y-6">
                <div className="bg-card rounded-xl border border-border/50 p-5">
                  <h3 className="font-semibold text-foreground mb-4">
                    Suppliers at This Site ({siteSuppliers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {siteSuppliers.map((supplier) => {
                      const supplierWOs = siteWOs.filter((wo) => wo.supplierId === supplier.id);
                      const closedSupplierWOs = supplierWOs.filter((wo) => wo.status === "Closed").length;
                      const completionRate = supplierWOs.length > 0
                        ? Math.round((closedSupplierWOs / supplierWOs.length) * 100)
                        : 0;
                      const supplierCost = supplierWOs.reduce((sum, wo) => sum + wo.cost, 0);
                      const overdueSupplierWOs = supplierWOs.filter(wo => wo.status === "Overdue").length;

                      return (
                        <div
                          key={supplier.id}
                          className="p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-all cursor-pointer"
                          onClick={() => navigate(`/suppliers/${supplier.id}`)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium">{supplier.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {supplier.serviceCategory}
                              </div>
                            </div>
                            <RAGBadge
                              status={completionRate >= 80 ? "green" : completionRate >= 60 ? "amber" : "red"}
                              size="sm"
                            />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Work Orders</span>
                              <span className="font-medium">{supplierWOs.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Completion Rate</span>
                              <span className={completionRate >= 80 ? "text-rag-green" : completionRate >= 60 ? "text-rag-amber" : "text-rag-red"}>
                                {completionRate}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Overdue</span>
                              <span className={overdueSupplierWOs > 0 ? "text-rag-red" : ""}>
                                {overdueSupplierWOs}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Cost</span>
                              <span className="font-medium">£{supplierCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="workorders" className="space-y-6">
                <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                  <div className="p-5 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Work Orders at This Site</h3>
                    <span className="text-sm text-muted-foreground">{siteWOs.length} total</span>
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
                          <th>Response (hrs)</th>
                          <th>Start Date</th>
                          <th className="text-right">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siteWOs.slice(0, 15).map((wo) => {
                          const supplier = suppliers.find((s) => s.id === wo.supplierId);
                          return (
                            <tr key={wo.id} className="cursor-pointer" onClick={() => navigate(`/suppliers/${wo.supplierId}`)}>
                              <td className="font-medium">{wo.id}</td>
                              <td>{supplier?.name}</td>
                              <td>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                  wo.category === "Emergency" ? "bg-rag-red/20 text-rag-red" :
                                  wo.category === "Reactive" ? "bg-rag-amber/20 text-rag-amber" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {wo.category}
                                </span>
                              </td>
                              <td>{wo.assetType}</td>
                              <td>
                                <RAGBadge
                                  status={
                                    wo.status === "Closed" ? "green" :
                                    wo.status === "Overdue" ? "red" : "amber"
                                  }
                                  label={wo.status}
                                  size="sm"
                                />
                              </td>
                              <td className={wo.responseTimeHours > 12 ? "text-rag-red" : ""}>
                                {wo.responseTimeHours}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
