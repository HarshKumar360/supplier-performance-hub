import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WorkOrderBreakdown } from "@/components/dashboard/WorkOrderBreakdown";
import { DetailedKPIPanel } from "@/components/dashboard/DetailedKPIPanel";
import { suppliers, kpis, predictiveSignals, workOrders, sites, getSupplierPerformance } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  Mail,
  Calendar,
  MapPin,
  CheckCircle2,
  Target,
  DollarSign,
  Shield,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Clock,
  Repeat,
  Activity,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";

export default function SupplierDeepDive() {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const supplier = suppliers.find((s) => s.id === supplierId);
  const performance = getSupplierPerformance().find((p) => p.supplierId === supplierId);
  const supplierKpis = kpis.filter((k) => k.supplierId === supplierId);
  const latestKpi = supplierKpis[supplierKpis.length - 1];
  const prevKpi = supplierKpis[supplierKpis.length - 2];
  const latestSignal = predictiveSignals.filter((s) => s.supplierId === supplierId).pop();
  const supplierWOs = workOrders.filter((wo) => wo.supplierId === supplierId);

  // Get sites this supplier operates at
  const supplierSiteIds = [...new Set(supplierWOs.map(wo => wo.siteId))];
  const supplierSites = sites.filter(s => supplierSiteIds.includes(s.id));

  if (!supplier || !performance || !latestKpi) {
    return (
      <DashboardLayout title="Supplier Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Supplier not found</p>
          <Button onClick={() => navigate("/suppliers")} className="mt-4">
            Back to Suppliers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const radarData = [
    { subject: "SLA", value: latestKpi.slaCompliance, fullMark: 100 },
    { subject: "FTFR", value: latestKpi.ftfr, fullMark: 100 },
    { subject: "Cost Eff.", value: Math.min(100, (1500 / latestKpi.costPerJob) * 100), fullMark: 100 },
    { subject: "Safety", value: latestKpi.safetyIncidents === 0 ? 100 : Math.max(0, 100 - latestKpi.safetyIncidents * 25), fullMark: 100 },
    { subject: "Repeat Jobs", value: 100 - latestKpi.repeatJobs, fullMark: 100 },
    { subject: "Response", value: Math.max(0, 100 - latestKpi.responseTimeAvg * 4), fullMark: 100 },
  ];

  const costTrend = supplierKpis.map((k) => ({
    month: k.month.slice(5),
    cost: k.costPerJob,
    avg: 1200,
  }));

  const performanceTrend = supplierKpis.map((k) => ({
    month: k.month.slice(5),
    sla: k.slaCompliance,
    ftfr: k.ftfr,
    uptime: k.assetUptime,
  }));

  const safetyTrend = supplierKpis.map((k) => ({
    month: k.month.slice(5),
    incidents: k.safetyIncidents,
    nearMisses: k.nearMisses,
  }));

  // Operational metrics for detailed panel
  const operationalMetrics = [
    { label: "Response Time", value: latestKpi.responseTimeAvg, previousValue: prevKpi?.responseTimeAvg, suffix: " hrs", target: 8, inverse: true },
    { label: "Completion Time", value: latestKpi.completionTimeAvg, previousValue: prevKpi?.completionTimeAvg, suffix: " days", target: 3, inverse: true },
    { label: "Repeat Jobs", value: latestKpi.repeatJobs, previousValue: prevKpi?.repeatJobs, suffix: "%", target: 10, inverse: true },
    { label: "PM Coverage", value: latestKpi.pmCoverage, previousValue: prevKpi?.pmCoverage, suffix: "%", target: 90 },
    { label: "Asset Uptime", value: latestKpi.assetUptime, previousValue: prevKpi?.assetUptime, suffix: "%", target: 95 },
    { label: "Compliance Violations", value: latestKpi.complianceViolations, previousValue: prevKpi?.complianceViolations, target: 0, inverse: true },
  ];

  const aiInsight = `${supplier.name} in ${supplier.region} shows ${
    performance.slaCompliance >= 90 ? "strong" : performance.slaCompliance >= 80 ? "acceptable" : "concerning"
  } SLA performance at ${performance.slaCompliance}%. ${
    latestSignal && latestSignal.slaBreachProbability > 30
      ? `There's a ${latestSignal.slaBreachProbability}% probability of SLA breach next month.`
      : "Risk indicators are within acceptable range."
  } ${
    latestKpi.repeatJobs > 15
      ? `High repeat job rate (${latestKpi.repeatJobs}%) suggests potential quality issues.`
      : ""
  } ${
    latestKpi.safetyIncidents > 0
      ? `Safety concerns: ${latestKpi.safetyIncidents} incident(s) recorded this month.`
      : "Safety performance is excellent with zero incidents."
  }`;

  const recommendations = [
    latestKpi.slaCompliance < 90 && "Improve SLA compliance through additional training and resource allocation.",
    latestKpi.repeatJobs > 15 && "Reduce repeat job rate by implementing root cause analysis for recurring issues.",
    latestKpi.safetyIncidents > 0 && "Address safety concerns through enhanced safety protocols and site inspections.",
    latestKpi.responseTimeAvg > 12 && "Optimize response times by improving dispatch procedures and local inventory.",
    latestSignal && latestSignal.riskScore > 50 && "High risk score detected - schedule governance review meeting.",
  ].filter(Boolean);

  return (
    <DashboardLayout
      title={supplier.name}
      subtitle={`${supplier.serviceCategory} • ${supplier.region}`}
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Supplier Profile Card */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{supplier.name}</h2>
                  <RAGBadge status={performance.status} />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {supplier.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {supplier.contactEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Contract: {supplier.startDate} to {supplier.endDate}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                    {supplier.serviceCategory}
                  </span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground font-medium">
                    {supplier.contractType}
                  </span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-accent/30 text-accent-foreground font-medium">
                    {supplier.slaLevel} SLA
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{performance.performanceScore}</div>
                <div className="text-sm text-muted-foreground">Performance Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground">{latestSignal?.riskScore || 0}</div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">AI Analysis</h4>
              <p className="text-sm text-muted-foreground">{aiInsight}</p>
              {recommendations.length > 0 && (
                <div className="mt-3 space-y-2">
                  <h5 className="text-xs font-medium text-foreground">Recommendations:</h5>
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {index + 1}
                      </span>
                      {rec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <KPICard
            title="SLA Compliance"
            value={performance.slaCompliance}
            suffix="%"
            icon={CheckCircle2}
            status={performance.slaCompliance >= 90 ? "green" : performance.slaCompliance >= 80 ? "amber" : "red"}
          />
          <KPICard
            title="FTFR"
            value={performance.ftfr}
            suffix="%"
            icon={Target}
            status={performance.ftfr >= 80 ? "green" : performance.ftfr >= 70 ? "amber" : "red"}
          />
          <KPICard
            title="Cost per Job"
            value={`£${performance.costPerJob}`}
            icon={DollarSign}
          />
          <KPICard
            title="Safety Incidents"
            value={performance.safetyIncidents}
            icon={Shield}
            status={performance.safetyIncidents === 0 ? "green" : performance.safetyIncidents <= 3 ? "amber" : "red"}
          />
          <KPICard
            title="Risk Score"
            value={performance.riskScore}
            icon={AlertTriangle}
            status={performance.riskScore <= 30 ? "green" : performance.riskScore <= 60 ? "amber" : "red"}
          />
          <KPICard
            title="Total Work Orders"
            value={supplierWOs.length}
            icon={FileText}
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PerformanceChart supplierId={supplierId} />
              </div>
              <DetailedKPIPanel title="Operational Metrics" metrics={operationalMetrics} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="chart-container">
                <h3 className="font-semibold text-foreground mb-4">KPI Radar</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Radar name="Performance" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <WorkOrderBreakdown supplierId={supplierId} />
            </div>

            {/* Performance Trend */}
            <div className="chart-container">
              <h3 className="font-semibold text-foreground mb-4">Performance Trends</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis domain={[60, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="sla" name="SLA %" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="ftfr" name="FTFR %" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="uptime" name="Uptime %" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Trend */}
              <div className="chart-container">
                <h3 className="font-semibold text-foreground mb-4">Cost per Job Trend</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={costTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} tickFormatter={(v) => `£${v}`} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: number) => [`£${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="cost" name="Cost per Job" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="avg" name="Budget" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-card rounded-xl border border-border/50 p-5">
                <h3 className="font-semibold text-foreground mb-4">Cost Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Total Work Orders</span>
                    <span className="font-semibold">{supplierWOs.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-semibold">£{supplierWOs.reduce((sum, wo) => sum + wo.cost, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Average Cost per WO</span>
                    <span className="font-semibold">£{Math.round(supplierWOs.reduce((sum, wo) => sum + wo.cost, 0) / supplierWOs.length)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/30">
                    <span className="text-muted-foreground">Cost Overrun Probability</span>
                    <span className={`font-semibold ${latestSignal && latestSignal.costOverrunProbability > 30 ? "text-rag-red" : ""}`}>
                      {latestSignal?.costOverrunProbability || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Budget Variance</span>
                    <span className={`font-semibold ${latestKpi.costPerJob > 1200 ? "text-rag-red" : "text-rag-green"}`}>
                      {latestKpi.costPerJob > 1200 ? "+" : "-"}£{Math.abs(latestKpi.costPerJob - 1200)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Safety Trend */}
              <div className="chart-container">
                <h3 className="font-semibold text-foreground mb-4">Safety Incidents Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={safetyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Bar dataKey="incidents" name="Incidents" fill="hsl(var(--rag-red))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="nearMisses" name="Near Misses" fill="hsl(var(--rag-amber))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Safety Summary */}
              <div className="bg-card rounded-xl border border-border/50 p-5">
                <h3 className="font-semibold text-foreground mb-4">Safety Summary</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <div className="text-3xl font-bold">{performance.safetyIncidents}</div>
                    <div className="text-sm text-muted-foreground">Total Incidents</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <div className="text-3xl font-bold">{supplierKpis.reduce((sum, k) => sum + k.nearMisses, 0)}</div>
                    <div className="text-sm text-muted-foreground">Near Misses</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <RAGBadge
                      status={performance.safetyIncidents === 0 ? "green" : performance.safetyIncidents <= 3 ? "amber" : "red"}
                      label={performance.safetyIncidents === 0 ? "Excellent" : performance.safetyIncidents <= 3 ? "Acceptable" : "Poor"}
                    />
                    <div className="text-sm text-muted-foreground mt-2">Safety Rating</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Safety Score Calculation:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Major incident: -50 points</li>
                    <li>• Minor incident: -20 points</li>
                    <li>• Near miss: -3 points</li>
                    <li>• Zero incidents: +15 points</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sites" className="space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-5">
              <h3 className="font-semibold text-foreground mb-4">Sites Served ({supplierSites.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {supplierSites.map((site) => {
                  const siteWOs = supplierWOs.filter(wo => wo.siteId === site.id);
                  const closedWOs = siteWOs.filter(wo => wo.status === "Closed").length;
                  const completionRate = siteWOs.length > 0 ? Math.round((closedWOs / siteWOs.length) * 100) : 0;
                  
                  return (
                    <div
                      key={site.id}
                      className="p-4 rounded-lg border border-border/50 bg-background hover:border-border transition-all cursor-pointer"
                      onClick={() => navigate("/sites")}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-xs text-muted-foreground">{site.country}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-xs bg-muted">{site.siteType}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Work Orders</span>
                          <span>{siteWOs.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Completion Rate</span>
                          <span className={completionRate >= 80 ? "text-rag-green" : "text-rag-amber"}>{completionRate}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Work Orders Table */}
            <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold text-foreground">Recent Work Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr className="bg-muted/30">
                      <th>WO ID</th>
                      <th>Site</th>
                      <th>Category</th>
                      <th>Asset Type</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>Response (hrs)</th>
                      <th className="text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierWOs.slice(0, 10).map((wo) => {
                      const site = sites.find(s => s.id === wo.siteId);
                      return (
                        <tr key={wo.id}>
                          <td className="font-medium">{wo.id}</td>
                          <td>{site?.name}</td>
                          <td>{wo.category}</td>
                          <td>{wo.assetType}</td>
                          <td>
                            <RAGBadge
                              status={wo.status === "Closed" ? "green" : wo.status === "Overdue" ? "red" : "amber"}
                              label={wo.status}
                              size="sm"
                            />
                          </td>
                          <td>{wo.startDate}</td>
                          <td>{wo.responseTimeHours}</td>
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
    </DashboardLayout>
  );
}
