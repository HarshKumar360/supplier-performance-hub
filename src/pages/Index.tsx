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
import { getGlobalKPIs } from "@/data/mockData";
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
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const globalKPIs = getGlobalKPIs();

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </section>

        {/* Secondary Metrics */}
        <section className="flex flex-wrap gap-3">
          <MetricPill
            label="Open Work Orders"
            value={globalKPIs.openWorkOrders}
            icon={FileText}
          />
          <MetricPill
            label="Safety Score"
            value={globalKPIs.safetyScore}
            icon={Shield}
            status={globalKPIs.safetyScore >= 90 ? "green" : globalKPIs.safetyScore >= 70 ? "amber" : "red"}
          />
          <MetricPill
            label="Active Suppliers"
            value={globalKPIs.totalSuppliers}
            icon={Building2}
          />
          <MetricPill
            label="Total Sites"
            value={globalKPIs.totalSites}
            icon={MapPin}
          />
        </section>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Regions */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeader
              title="Regions"
              icon={Globe}
            />
            <RegionSelector
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />
          </div>

          {/* Center Column - Supplier Performance */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              title="Supplier Performance"
              subtitle="Top performers ranked by composite score"
              icon={TrendingUp}
              action={{
                label: "View All",
                onClick: () => navigate("/suppliers"),
              }}
            />
            <SupplierLeaderboard />
          </div>

          {/* Right Column - Alerts & Insights */}
          <div className="lg:col-span-3 space-y-6">
            <SectionHeader
              title="Alerts"
              icon={Bell}
            />
            <AlertsPanel />
          </div>
        </div>

        {/* Analytics Section */}
        <section>
          <SectionHeader
            title="Analytics"
            subtitle="Performance trends and work order distribution"
            icon={BarChart3}
            action={{
              label: "Predictive Insights",
              onClick: () => navigate("/predictive"),
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2">
              <PerformanceChart />
            </div>
            <div>
              <WorkOrderBreakdown />
            </div>
          </div>
        </section>

        {/* AI Insights Section */}
        <section>
          <SectionHeader
            title="AI Insights"
            subtitle="Intelligent recommendations from BP Analytics Engine"
            action={{
              label: "Open Assistant",
              onClick: () => navigate("/ai-assistant"),
            }}
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
