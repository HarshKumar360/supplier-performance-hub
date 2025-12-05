import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeroKPICard } from "@/components/dashboard/HeroKPICard";
import { MetricPill } from "@/components/dashboard/MetricPill";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { QuickInsightCard } from "@/components/dashboard/QuickInsightCard";
import { SupplierLeaderboard } from "@/components/dashboard/SupplierLeaderboard";
import { RegionSelector } from "@/components/dashboard/RegionSelector";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WorkOrderBreakdown } from "@/components/dashboard/WorkOrderBreakdown";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { AreaTrendChart } from "@/components/dashboard/AreaTrendChart";
import { RegionHeatmap } from "@/components/dashboard/RegionHeatmap";
import { AssetTypeBreakdown } from "@/components/dashboard/AssetTypeBreakdown";
import { SupplierComparisonChart } from "@/components/dashboard/SupplierComparisonChart";
import { SafetyTrendChart } from "@/components/dashboard/SafetyTrendChart";
import { CostAnalysisChart } from "@/components/dashboard/CostAnalysisChart";
import { DetailedKPIPanel } from "@/components/dashboard/DetailedKPIPanel";
import { getGlobalKPIs, kpis, workOrders, suppliers } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Target,
  FileText,
  Zap,
  Shield,
  Building2,
  MapPin,
  TrendingUp,
  Bell,
  BarChart3,
  Globe,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const globalKPIs = getGlobalKPIs();

  // Calculate additional metrics
  const latestKpis = kpis.filter(k => k.month === "2024-12");
  const avgResponseTime = Math.round(latestKpis.reduce((sum, k) => sum + k.responseTimeAvg, 0) / latestKpis.length);
  const avgCostPerJob = Math.round(latestKpis.reduce((sum, k) => sum + k.costPerJob, 0) / latestKpis.length);
  const totalIncidents = latestKpis.reduce((sum, k) => sum + k.safetyIncidents, 0);
  const overdueWOs = workOrders.filter(wo => wo.status === "Overdue").length;
  const delayedWOs = workOrders.filter(wo => wo.status === "Delayed").length;

  const operationalMetrics = [
    { label: "Avg Response Time", value: avgResponseTime, suffix: " hrs", target: 8, inverse: true, description: "Average time to first response" },
    { label: "Avg Cost per Job", value: avgCostPerJob, prefix: "£", target: 1200, inverse: true, description: "Average job completion cost" },
    { label: "PM Coverage", value: Math.round(latestKpis.reduce((sum, k) => sum + k.pmCoverage, 0) / latestKpis.length), suffix: "%", target: 90, description: "Preventive maintenance coverage" },
    { label: "Asset Uptime", value: Math.round(latestKpis.reduce((sum, k) => sum + k.assetUptime, 0) / latestKpis.length), suffix: "%", target: 95, description: "Overall asset availability" },
    { label: "Repeat Jobs", value: Math.round(latestKpis.reduce((sum, k) => sum + k.repeatJobs, 0) / latestKpis.length), suffix: "%", target: 10, inverse: true, description: "Jobs requiring revisit" },
    { label: "Compliance Violations", value: latestKpis.reduce((sum, k) => sum + k.complianceViolations, 0), target: 0, inverse: true, description: "Total compliance issues" },
  ];

  const aiInsights = [
    {
      insight: "ISS Germany shows rising delay trend of 12% MoM, driven by HVAC stockouts in Berlin.",
      supplier: "ISS Germany",
      severity: "warning" as const,
    },
    {
      insight: "3 EV charger failures predicted in next 30 days at London Heathrow Hub.",
      supplier: "EVTech Solutions",
      severity: "critical" as const,
    },
    {
      insight: "CBRE UK maintained Gold SLA for 8 consecutive months. Cost per job reduced by 15%.",
      supplier: "CBRE UK",
      severity: "info" as const,
    },
  ];

  return (
    <DashboardLayout
      title="Global Overview"
      subtitle={selectedRegion ? `Filtered: ${selectedRegion}` : "All Regions • Real-time"}
    >
      <div className="space-y-8">
        {/* Hero KPIs Section */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <HeroKPICard
              title="Global SLA Compliance"
              value={globalKPIs.globalSla}
              suffix="%"
              icon={CheckCircle2}
              status={globalKPIs.globalSla >= 90 ? "green" : globalKPIs.globalSla >= 80 ? "amber" : "red"}
              trend={2.3}
              description="Service Level Agreement performance"
            />
            <HeroKPICard
              title="First Time Fix Rate"
              value={globalKPIs.globalFtfr}
              suffix="%"
              icon={Target}
              status={globalKPIs.globalFtfr >= 80 ? "green" : globalKPIs.globalFtfr >= 70 ? "amber" : "red"}
              trend={-1.2}
              description="Issues resolved on first visit"
            />
            <HeroKPICard
              title="Critical EV Outages"
              value={globalKPIs.criticalEVOutages}
              icon={Zap}
              status={globalKPIs.criticalEVOutages > 5 ? "red" : globalKPIs.criticalEVOutages > 2 ? "amber" : "green"}
              description="Chargers offline > 12 hours"
            />
            <HeroKPICard
              title="Safety Score"
              value={globalKPIs.safetyScore}
              suffix="/100"
              icon={Shield}
              status={globalKPIs.safetyScore >= 90 ? "green" : globalKPIs.safetyScore >= 70 ? "amber" : "red"}
              trend={5}
              description="Composite safety rating"
            />
          </div>
        </section>

        {/* Secondary Metrics */}
        <section className="flex flex-wrap gap-3">
          <MetricPill label="Open Work Orders" value={globalKPIs.openWorkOrders} icon={FileText} />
          <MetricPill label="Overdue WOs" value={overdueWOs} icon={AlertTriangle} status={overdueWOs > 10 ? "red" : overdueWOs > 5 ? "amber" : "green"} />
          <MetricPill label="Delayed WOs" value={delayedWOs} icon={Clock} status={delayedWOs > 15 ? "amber" : "green"} />
          <MetricPill label="Active Suppliers" value={globalKPIs.totalSuppliers} icon={Building2} />
          <MetricPill label="Total Sites" value={globalKPIs.totalSites} icon={MapPin} />
          <MetricPill label="Safety Incidents" value={totalIncidents} icon={Shield} status={totalIncidents > 5 ? "red" : totalIncidents > 2 ? "amber" : "green"} />
          <MetricPill label="Avg Cost/Job" value={`£${avgCostPerJob}`} icon={DollarSign} />
        </section>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Regions & Detailed KPIs */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeader title="Regions" icon={Globe} />
            <RegionSelector selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
            <DetailedKPIPanel title="Operational Metrics" metrics={operationalMetrics} />
          </div>

          {/* Center Column - Supplier Performance */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              title="Supplier Performance"
              subtitle="Top performers ranked by composite score"
              icon={TrendingUp}
              action={{ label: "View All", onClick: () => navigate("/suppliers") }}
            />
            <SupplierLeaderboard />
          </div>

          {/* Right Column - Alerts & Insights */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeader title="Alerts" icon={Bell} />
            <AlertsPanel />
          </div>
        </div>

        {/* Analytics Section with Tabs */}
        <section>
          <SectionHeader
            title="Analytics"
            subtitle="Deep dive into performance metrics"
            icon={BarChart3}
            action={{ label: "Predictive Insights", onClick: () => navigate("/predictions") }}
          />
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceChart />
                <SupplierComparisonChart />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AreaTrendChart metric="sla" />
                <AreaTrendChart metric="ftfr" />
                <WorkOrderBreakdown />
              </div>
            </TabsContent>
            <TabsContent value="costs" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CostAnalysisChart />
                <CostAnalysisChart showRegions />
              </div>
              <AreaTrendChart metric="cost" title="Average Cost per Job" />
            </TabsContent>
            <TabsContent value="safety" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SafetyTrendChart />
                <RegionHeatmap />
              </div>
            </TabsContent>
            <TabsContent value="assets" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AssetTypeBreakdown />
                <WorkOrderBreakdown />
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* AI Insights Section */}
        <section>
          <SectionHeader
            title="AI Insights"
            subtitle="Intelligent recommendations from BP Analytics Engine"
            action={{ label: "Open Assistant", onClick: () => navigate("/ai-assistant") }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((item, index) => (
              <QuickInsightCard
                key={index}
                insight={item.insight}
                supplier={item.supplier}
                severity={item.severity}
                onClick={() => navigate("/ai-assistant")}
              />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
