import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { suppliers, kpis, getSupplierPerformance, predictiveSignals } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Download, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Scorecards() {
  const [selectedSupplier, setSelectedSupplier] = useState(suppliers[0].id);

  const supplier = suppliers.find((s) => s.id === selectedSupplier);
  const performance = getSupplierPerformance().find((p) => p.supplierId === selectedSupplier);
  const supplierKpis = kpis.filter((k) => k.supplierId === selectedSupplier);
  const latestKpi = supplierKpis[supplierKpis.length - 1];
  const prevKpi = supplierKpis[supplierKpis.length - 2];
  const latestSignal = predictiveSignals.filter((s) => s.supplierId === selectedSupplier).pop();

  if (!supplier || !performance || !latestKpi) return null;

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: TrendingUp, color: "text-rag-green" };
    if (current < previous) return { icon: TrendingDown, color: "text-rag-red" };
    return { icon: Minus, color: "text-muted-foreground" };
  };

  const handleExport = () => {
    toast({
      title: "Scorecard Export",
      description: `${supplier.name} scorecard PDF is being generated...`,
    });
  };

  // AI-generated recommendations
  const recommendations = [
    latestKpi.slaCompliance < 90
      ? "Improve SLA compliance through additional training and resource allocation."
      : null,
    latestKpi.repeatJobs > 15
      ? "Reduce repeat job rate by implementing root cause analysis for recurring issues."
      : null,
    latestKpi.safetyIncidents > 0
      ? "Address safety concerns through enhanced safety protocols and site inspections."
      : null,
    latestKpi.responseTimeAvg > 12
      ? "Optimize response times by improving dispatch procedures and local inventory."
      : null,
    "Continue preventive maintenance program to maintain asset uptime levels.",
  ].filter(Boolean);

  // Benchmark data (mock - would come from peer comparison)
  const benchmarks = {
    slaCompliance: { supplier: latestKpi.slaCompliance, average: 88, top: 96 },
    ftfr: { supplier: latestKpi.ftfr, average: 78, top: 92 },
    costPerJob: { supplier: latestKpi.costPerJob, average: 1200, top: 850 },
    responseTime: { supplier: latestKpi.responseTimeAvg, average: 8, top: 3 },
  };

  return (
    <DashboardLayout
      title="Supplier Scorecards"
      subtitle="Auto-generated performance reports"
    >
      <div className="space-y-6">
        {/* Supplier Selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} - {s.region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Scorecard Preview */}
        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-primary-foreground">{supplier.name}</h2>
                  <p className="text-primary-foreground/80">
                    {supplier.serviceCategory} • {supplier.region} • {supplier.slaLevel} SLA
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary-foreground">
                  {performance.performanceScore}
                </div>
                <div className="text-primary-foreground/80 text-sm">Performance Score</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Summary */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Executive Summary
              </h3>
              <p className="text-muted-foreground">
                {supplier.name} has maintained {performance.status === "green" ? "strong" : performance.status === "amber" ? "acceptable" : "concerning"} performance
                in {new Date().toLocaleString("default", { month: "long", year: "numeric" })}. 
                SLA compliance stands at {latestKpi.slaCompliance}% with a first-time fix rate of {latestKpi.ftfr}%.
                {latestKpi.safetyIncidents > 0
                  ? ` There were ${latestKpi.safetyIncidents} safety incident(s) recorded.`
                  : " No safety incidents were recorded."}
              </p>
            </div>

            {/* Monthly KPIs */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Monthly KPI Performance
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "SLA Compliance", value: latestKpi.slaCompliance, prev: prevKpi?.slaCompliance, suffix: "%" },
                  { label: "FTFR", value: latestKpi.ftfr, prev: prevKpi?.ftfr, suffix: "%" },
                  { label: "Response Time", value: latestKpi.responseTimeAvg, prev: prevKpi?.responseTimeAvg, suffix: "hrs", inverse: true },
                  { label: "Cost per Job", value: latestKpi.costPerJob, prev: prevKpi?.costPerJob, prefix: "£", inverse: true },
                  { label: "Repeat Jobs", value: latestKpi.repeatJobs, prev: prevKpi?.repeatJobs, suffix: "%", inverse: true },
                  { label: "Asset Uptime", value: latestKpi.assetUptime, prev: prevKpi?.assetUptime, suffix: "%" },
                  { label: "PM Coverage", value: latestKpi.pmCoverage, prev: prevKpi?.pmCoverage, suffix: "%" },
                  { label: "Compliance Violations", value: latestKpi.complianceViolations, prev: prevKpi?.complianceViolations, inverse: true },
                ].map((metric) => {
                  const trend = prevKpi
                    ? getTrend(
                        metric.inverse ? -metric.value : metric.value,
                        metric.inverse ? -(metric.prev || 0) : (metric.prev || 0)
                      )
                    : null;
                  const TrendIcon = trend?.icon || Minus;

                  return (
                    <div key={metric.label} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="text-sm text-muted-foreground mb-1">{metric.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {metric.prefix}{metric.value}{metric.suffix}
                        </span>
                        {trend && <TrendIcon className={`w-4 h-4 ${trend.color}`} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safety Summary */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Safety Summary
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <div className="text-3xl font-bold">{latestKpi.safetyIncidents}</div>
                  <div className="text-sm text-muted-foreground">Safety Incidents</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <div className="text-3xl font-bold">{latestKpi.nearMisses}</div>
                  <div className="text-sm text-muted-foreground">Near Misses</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <RAGBadge
                    status={latestKpi.safetyIncidents === 0 ? "green" : latestKpi.safetyIncidents <= 2 ? "amber" : "red"}
                    label={latestKpi.safetyIncidents === 0 ? "Excellent" : latestKpi.safetyIncidents <= 2 ? "Acceptable" : "Needs Attention"}
                  />
                  <div className="text-sm text-muted-foreground mt-2">Safety Rating</div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                Benchmark vs Peer Suppliers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-medium text-muted-foreground">Metric</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">This Supplier</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">Peer Average</th>
                      <th className="text-center py-3 font-medium text-muted-foreground">Top Performer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3">SLA Compliance</td>
                      <td className="py-3 text-center font-medium">{benchmarks.slaCompliance.supplier}%</td>
                      <td className="py-3 text-center text-muted-foreground">{benchmarks.slaCompliance.average}%</td>
                      <td className="py-3 text-center text-rag-green">{benchmarks.slaCompliance.top}%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3">FTFR</td>
                      <td className="py-3 text-center font-medium">{benchmarks.ftfr.supplier}%</td>
                      <td className="py-3 text-center text-muted-foreground">{benchmarks.ftfr.average}%</td>
                      <td className="py-3 text-center text-rag-green">{benchmarks.ftfr.top}%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3">Cost per Job</td>
                      <td className="py-3 text-center font-medium">£{benchmarks.costPerJob.supplier}</td>
                      <td className="py-3 text-center text-muted-foreground">£{benchmarks.costPerJob.average}</td>
                      <td className="py-3 text-center text-rag-green">£{benchmarks.costPerJob.top}</td>
                    </tr>
                    <tr>
                      <td className="py-3">Response Time</td>
                      <td className="py-3 text-center font-medium">{benchmarks.responseTime.supplier} hrs</td>
                      <td className="py-3 text-center text-muted-foreground">{benchmarks.responseTime.average} hrs</td>
                      <td className="py-3 text-center text-rag-green">{benchmarks.responseTime.top} hrs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Generated Recommendations
              </h3>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
