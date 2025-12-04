import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KPICard } from "@/components/dashboard/KPICard";
import { SupplierLeaderboard } from "@/components/dashboard/SupplierLeaderboard";
import { RegionSelector } from "@/components/dashboard/RegionSelector";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { WorkOrderBreakdown } from "@/components/dashboard/WorkOrderBreakdown";
import { AIInsightPanel } from "@/components/dashboard/AIInsightPanel";
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
} from "lucide-react";

export default function Index() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const globalKPIs = getGlobalKPIs();

  return (
    <DashboardLayout
      title="Global Supplier Overview"
      subtitle={selectedRegion ? `Filtered by ${selectedRegion}` : "All Regions"}
    >
      <div className="space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <KPICard
            title="Global SLA"
            value={globalKPIs.globalSla}
            suffix="%"
            icon={CheckCircle2}
            status={globalKPIs.globalSla >= 90 ? "green" : globalKPIs.globalSla >= 80 ? "amber" : "red"}
            trend={2.3}
          />
          <KPICard
            title="Global FTFR"
            value={globalKPIs.globalFtfr}
            suffix="%"
            icon={Target}
            status={globalKPIs.globalFtfr >= 80 ? "green" : globalKPIs.globalFtfr >= 70 ? "amber" : "red"}
            trend={-1.2}
          />
          <KPICard
            title="Open Work Orders"
            value={globalKPIs.openWorkOrders}
            icon={FileText}
            trend={5.8}
          />
          <KPICard
            title="Critical EV Outages"
            value={globalKPIs.criticalEVOutages}
            icon={Zap}
            status={globalKPIs.criticalEVOutages > 5 ? "red" : globalKPIs.criticalEVOutages > 2 ? "amber" : "green"}
          />
          <KPICard
            title="Safety Score"
            value={globalKPIs.safetyScore}
            icon={Shield}
            status={globalKPIs.safetyScore >= 90 ? "green" : globalKPIs.safetyScore >= 70 ? "amber" : "red"}
          />
          <KPICard
            title="Total Suppliers"
            value={globalKPIs.totalSuppliers}
            icon={Building2}
          />
          <KPICard
            title="Total Sites"
            value={globalKPIs.totalSites}
            icon={MapPin}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Leaderboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* Region Selector */}
            <RegionSelector
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* Supplier Leaderboard */}
            <SupplierLeaderboard />

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PerformanceChart />
              <WorkOrderBreakdown />
            </div>
          </div>

          {/* Right Column - AI & Alerts */}
          <div className="space-y-6">
            <AIInsightPanel />
            <AlertsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
