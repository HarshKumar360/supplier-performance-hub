import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WorkOrderBreakdown } from "@/components/dashboard/WorkOrderBreakdown";
import { suppliers, kpis, predictiveSignals, workOrders, getSupplierPerformance } from "@/data/mockData";
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
} from "recharts";

export default function SupplierDeepDive() {
  const { supplierId } = useParams();
  const navigate = useNavigate();

  const supplier = suppliers.find((s) => s.id === supplierId);
  const performance = getSupplierPerformance().find((p) => p.supplierId === supplierId);
  const supplierKpis = kpis.filter((k) => k.supplierId === supplierId);
  const latestKpi = supplierKpis[supplierKpis.length - 1];
  const latestSignal = predictiveSignals.filter((s) => s.supplierId === supplierId).pop();
  const supplierWOs = workOrders.filter((wo) => wo.supplierId === supplierId);

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
  }));

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
  }`;

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

            <div className="text-center md:text-right">
              <div className="text-4xl font-bold text-primary">{performance.performanceScore}</div>
              <div className="text-sm text-muted-foreground">Performance Score</div>
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
            icon={TrendingUp}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trend */}
          <PerformanceChart supplierId={supplierId} />

          {/* Radar Chart */}
          <div className="chart-container">
            <h3 className="font-semibold text-foreground mb-4">KPI Radar</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Work Order Breakdown */}
          <WorkOrderBreakdown supplierId={supplierId} />

          {/* Cost Trend */}
          <div className="chart-container">
            <h3 className="font-semibold text-foreground mb-4">Cost Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`£${value}`, "Cost per Job"]}
                  />
                  <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
                  <th>Category</th>
                  <th>Asset Type</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>Response (hrs)</th>
                  <th className="text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {supplierWOs.slice(0, 10).map((wo) => (
                  <tr key={wo.id}>
                    <td className="font-medium">{wo.id}</td>
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
                    <td>{wo.responseTimeHours}</td>
                    <td className="text-right">£{wo.cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
