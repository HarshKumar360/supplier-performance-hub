// Supplier Data
export interface Supplier {
  id: string;
  name: string;
  region: string;
  serviceCategory: string;
  contractType: string;
  slaLevel: string;
  contactEmail: string;
  startDate: string;
  endDate: string;
}

export const suppliers: Supplier[] = [
  { id: "SUP001", name: "CBRE", region: "UK", serviceCategory: "FM", contractType: "Fixed", slaLevel: "Gold", contactEmail: "contracts@cbre.com", startDate: "2022-01-01", endDate: "2025-12-31" },
  { id: "SUP002", name: "ISS", region: "Germany", serviceCategory: "FM", contractType: "Hybrid", slaLevel: "Gold", contactEmail: "bp@iss.de", startDate: "2021-06-01", endDate: "2024-12-31" },
  { id: "SUP003", name: "SPIE", region: "Netherlands", serviceCategory: "Engineering", contractType: "T&M", slaLevel: "Silver", contactEmail: "operations@spie.nl", startDate: "2023-01-01", endDate: "2026-01-01" },
  { id: "SUP004", name: "Mitie", region: "UK", serviceCategory: "HVAC", contractType: "Fixed", slaLevel: "Gold", contactEmail: "hvac@mitie.co.uk", startDate: "2022-03-01", endDate: "2025-03-01" },
  { id: "SUP005", name: "Vinci", region: "Germany", serviceCategory: "Civils", contractType: "Hybrid", slaLevel: "Silver", contactEmail: "infra@vinci.de", startDate: "2021-09-01", endDate: "2024-09-01" },
  { id: "SUP006", name: "Bilfinger", region: "Netherlands", serviceCategory: "Engineering", contractType: "Fixed", slaLevel: "Gold", contactEmail: "projects@bilfinger.nl", startDate: "2022-07-01", endDate: "2025-07-01" },
  { id: "SUP007", name: "EVTech Solutions", region: "UK", serviceCategory: "EV Maintenance", contractType: "T&M", slaLevel: "Gold", contactEmail: "support@evtech.co.uk", startDate: "2023-03-01", endDate: "2026-03-01" },
  { id: "SUP008", name: "ChargePoint Services", region: "US", serviceCategory: "EV Maintenance", contractType: "Fixed", slaLevel: "Gold", contactEmail: "service@chargepoint.com", startDate: "2022-11-01", endDate: "2025-11-01" },
  { id: "SUP009", name: "SafetyFirst Ltd", region: "UK", serviceCategory: "Compliance", contractType: "Fixed", slaLevel: "Silver", contactEmail: "compliance@safetyfirst.co.uk", startDate: "2021-04-01", endDate: "2024-04-01" },
  { id: "SUP010", name: "ClimaTech", region: "ANZ", serviceCategory: "HVAC", contractType: "Hybrid", slaLevel: "Silver", contactEmail: "service@climatech.com.au", startDate: "2023-02-01", endDate: "2026-02-01" },
  { id: "SUP011", name: "Sodexo", region: "South Africa", serviceCategory: "FM", contractType: "Fixed", slaLevel: "Bronze", contactEmail: "facilities@sodexo.za", startDate: "2022-08-01", endDate: "2025-08-01" },
  { id: "SUP012", name: "Engie", region: "Germany", serviceCategory: "Engineering", contractType: "Hybrid", slaLevel: "Gold", contactEmail: "energy@engie.de", startDate: "2021-12-01", endDate: "2024-12-01" },
];

// Site Data
export interface Site {
  id: string;
  name: string;
  country: string;
  region: string;
  siteType: string;
  assetCount: number;
}

export const sites: Site[] = [
  { id: "SITE001", name: "London Heathrow Hub", country: "United Kingdom", region: "UK", siteType: "EV Hub", assetCount: 45 },
  { id: "SITE002", name: "Birmingham Central", country: "United Kingdom", region: "UK", siteType: "Mixed", assetCount: 32 },
  { id: "SITE003", name: "Manchester M60", country: "United Kingdom", region: "UK", siteType: "Fuel Retail", assetCount: 28 },
  { id: "SITE004", name: "Berlin Alexanderplatz", country: "Germany", region: "Germany", siteType: "EV Hub", assetCount: 52 },
  { id: "SITE005", name: "Munich Autobahn A8", country: "Germany", region: "Germany", siteType: "Mixed", assetCount: 38 },
  { id: "SITE006", name: "Hamburg Port", country: "Germany", region: "Germany", siteType: "Fuel Retail", assetCount: 25 },
  { id: "SITE007", name: "Amsterdam Schiphol", country: "Netherlands", region: "Netherlands", siteType: "EV Hub", assetCount: 48 },
  { id: "SITE008", name: "Rotterdam Industrial", country: "Netherlands", region: "Netherlands", siteType: "Fuel Retail", assetCount: 22 },
  { id: "SITE009", name: "New York JFK", country: "United States", region: "US", siteType: "EV Hub", assetCount: 65 },
  { id: "SITE010", name: "Los Angeles LAX", country: "United States", region: "US", siteType: "Mixed", assetCount: 58 },
  { id: "SITE011", name: "Chicago O'Hare", country: "United States", region: "US", siteType: "EV Hub", assetCount: 42 },
  { id: "SITE012", name: "Sydney CBD", country: "Australia", region: "ANZ", siteType: "Mixed", assetCount: 35 },
  { id: "SITE013", name: "Melbourne Airport", country: "Australia", region: "ANZ", siteType: "EV Hub", assetCount: 40 },
  { id: "SITE014", name: "Cape Town Central", country: "South Africa", region: "South Africa", siteType: "Fuel Retail", assetCount: 18 },
  { id: "SITE015", name: "Johannesburg N1", country: "South Africa", region: "South Africa", siteType: "Mixed", assetCount: 24 },
];

// Work Order Data
export interface WorkOrder {
  id: string;
  supplierId: string;
  siteId: string;
  category: string;
  assetType: string;
  status: string;
  startDate: string;
  completionDate: string | null;
  responseTimeHours: number;
  cost: number;
}

const categories = ["Reactive", "Planned", "Emergency", "Compliance"];
const assetTypes = ["EV Charger", "Pump", "ATG", "HVAC", "Lighting", "Refrigerator", "Car Wash"];
const statuses = ["Open", "Closed", "Delayed", "Overdue"];

export const workOrders: WorkOrder[] = Array.from({ length: 120 }, (_, i) => {
  const supplierId = suppliers[Math.floor(Math.random() * suppliers.length)].id;
  const siteId = sites[Math.floor(Math.random() * sites.length)].id;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  
  return {
    id: `WO${String(i + 1).padStart(5, "0")}`,
    supplierId,
    siteId,
    category: categories[Math.floor(Math.random() * categories.length)],
    assetType: assetTypes[Math.floor(Math.random() * assetTypes.length)],
    status,
    startDate: startDate.toISOString().split("T")[0],
    completionDate: status === "Closed" ? new Date(startDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : null,
    responseTimeHours: Math.floor(Math.random() * 48) + 1,
    cost: Math.floor(Math.random() * 5000) + 200,
  };
});

// KPI Data (Monthly Supplier Performance)
export interface KPI {
  supplierId: string;
  month: string;
  slaCompliance: number;
  ftfr: number;
  responseTimeAvg: number;
  completionTimeAvg: number;
  costPerJob: number;
  safetyIncidents: number;
  nearMisses: number;
  repeatJobs: number;
  complianceViolations: number;
  assetUptime: number;
  pmCoverage: number;
  energyWasteEvents: number;
}

const months = [
  "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
  "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
];

export const kpis: KPI[] = suppliers.flatMap(supplier => 
  months.map(month => ({
    supplierId: supplier.id,
    month,
    slaCompliance: Math.floor(Math.random() * 20) + 80,
    ftfr: Math.floor(Math.random() * 25) + 70,
    responseTimeAvg: Math.floor(Math.random() * 20) + 2,
    completionTimeAvg: Math.floor(Math.random() * 5) + 1,
    costPerJob: Math.floor(Math.random() * 1500) + 500,
    safetyIncidents: Math.floor(Math.random() * 3),
    nearMisses: Math.floor(Math.random() * 5),
    repeatJobs: Math.floor(Math.random() * 15) + 5,
    complianceViolations: Math.floor(Math.random() * 2),
    assetUptime: Math.floor(Math.random() * 10) + 90,
    pmCoverage: Math.floor(Math.random() * 20) + 80,
    energyWasteEvents: Math.floor(Math.random() * 5),
  }))
);

// Predictive Signals
export interface PredictiveSignal {
  supplierId: string;
  month: string;
  slaBreachProbability: number;
  costOverrunProbability: number;
  expectedDelayDays: number;
  riskScore: number;
  evChargerFailureProbability: number;
  carbonImpactRating: string;
}

export const predictiveSignals: PredictiveSignal[] = suppliers.flatMap(supplier =>
  months.map(month => ({
    supplierId: supplier.id,
    month,
    slaBreachProbability: Math.floor(Math.random() * 50) + 5,
    costOverrunProbability: Math.floor(Math.random() * 40) + 10,
    expectedDelayDays: Math.floor(Math.random() * 5),
    riskScore: Math.floor(Math.random() * 100),
    evChargerFailureProbability: Math.floor(Math.random() * 30) + 5,
    carbonImpactRating: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
  }))
);

// Calculated Supplier Performance
export interface SupplierPerformance {
  supplierId: string;
  supplierName: string;
  region: string;
  slaCompliance: number;
  ftfr: number;
  costPerJob: number;
  safetyIncidents: number;
  riskScore: number;
  performanceScore: number;
  status: 'green' | 'amber' | 'red';
}

export function calculatePerformanceScore(kpi: KPI): number {
  const safetyScore = kpi.safetyIncidents === 0 ? 100 : Math.max(0, 100 - (kpi.safetyIncidents * 25));
  const costEfficiency = Math.min(100, (1500 / kpi.costPerJob) * 100);
  const responseScore = Math.max(0, 100 - (kpi.responseTimeAvg * 4));
  const completionScore = Math.max(0, 100 - (kpi.completionTimeAvg * 10));
  const complianceScore = Math.max(0, 100 - (kpi.complianceViolations * 30));

  return Math.round(
    0.20 * kpi.slaCompliance +
    0.15 * kpi.ftfr +
    0.15 * (100 - kpi.repeatJobs) +
    0.10 * safetyScore +
    0.10 * costEfficiency +
    0.10 * responseScore +
    0.10 * completionScore +
    0.10 * complianceScore
  );
}

export function getSupplierPerformance(): SupplierPerformance[] {
  return suppliers.map(supplier => {
    const supplierKpis = kpis.filter(k => k.supplierId === supplier.id);
    const latestKpi = supplierKpis[supplierKpis.length - 1];
    const signals = predictiveSignals.filter(s => s.supplierId === supplier.id);
    const latestSignal = signals[signals.length - 1];

    const avgSla = supplierKpis.reduce((sum, k) => sum + k.slaCompliance, 0) / supplierKpis.length;
    const avgFtfr = supplierKpis.reduce((sum, k) => sum + k.ftfr, 0) / supplierKpis.length;
    const avgCost = supplierKpis.reduce((sum, k) => sum + k.costPerJob, 0) / supplierKpis.length;
    const totalIncidents = supplierKpis.reduce((sum, k) => sum + k.safetyIncidents, 0);
    
    const performanceScore = calculatePerformanceScore(latestKpi);
    
    let status: 'green' | 'amber' | 'red' = 'green';
    if (avgSla < 80 || latestKpi.ftfr < 70) status = 'red';
    else if (avgSla < 90) status = 'amber';

    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      region: supplier.region,
      slaCompliance: Math.round(avgSla),
      ftfr: Math.round(avgFtfr),
      costPerJob: Math.round(avgCost),
      safetyIncidents: totalIncidents,
      riskScore: latestSignal?.riskScore || 0,
      performanceScore,
      status,
    };
  });
}

// Global KPI Aggregates
export function getGlobalKPIs() {
  const allKpis = kpis.filter(k => k.month === "2024-12");
  const avgSla = allKpis.reduce((sum, k) => sum + k.slaCompliance, 0) / allKpis.length;
  const avgFtfr = allKpis.reduce((sum, k) => sum + k.ftfr, 0) / allKpis.length;
  const totalIncidents = allKpis.reduce((sum, k) => sum + k.safetyIncidents, 0);
  
  const openWOs = workOrders.filter(wo => wo.status === "Open" || wo.status === "Delayed").length;
  const criticalEVOutages = workOrders.filter(wo => wo.assetType === "EV Charger" && wo.status === "Overdue").length;
  
  const safetyScore = Math.max(0, 100 - (totalIncidents * 5));

  return {
    globalSla: Math.round(avgSla),
    globalFtfr: Math.round(avgFtfr),
    openWorkOrders: openWOs,
    criticalEVOutages,
    safetyScore,
    totalSuppliers: suppliers.length,
    totalSites: sites.length,
  };
}

// Region-based aggregation
export function getRegionData() {
  const regions = ["UK", "Germany", "Netherlands", "US", "ANZ", "South Africa"];
  
  return regions.map(region => {
    const regionSuppliers = suppliers.filter(s => s.region === region);
    const regionSites = sites.filter(s => s.region === region);
    const regionWOs = workOrders.filter(wo => {
      const site = sites.find(s => s.id === wo.siteId);
      return site?.region === region;
    });
    
    return {
      region,
      supplierCount: regionSuppliers.length,
      siteCount: regionSites.length,
      openWOs: regionWOs.filter(wo => wo.status !== "Closed").length,
      totalAssets: regionSites.reduce((sum, s) => sum + s.assetCount, 0),
    };
  });
}
