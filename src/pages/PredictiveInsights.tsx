import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { predictiveSignals, suppliers, kpis, workOrders } from "@/data/mockData";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { AlertTriangle, TrendingUp, Zap, DollarSign, Gauge, Brain, Target, Activity, Calendar } from "lucide-react";

export default function PredictiveInsights() {
  const navigate = useNavigate();
  const [responseReduction, setResponseReduction] = useState([20]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30");

  // SLA Breach Probability over time
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const slaTrend = months.map((month) => {
    const monthSignals = predictiveSignals.filter((s) => s.month.endsWith(month));
    const avgProb = monthSignals.reduce((sum, s) => sum + s.slaBreachProbability, 0) / monthSignals.length;
    const avgCost = monthSignals.reduce((sum, s) => sum + s.costOverrunProbability, 0) / monthSignals.length;
    return { month, slaProb: Math.round(avgProb), costProb: Math.round(avgCost) };
  });

  // Cost Overrun Forecast
  const costForecast = suppliers.map((supplier) => {
    const signals = predictiveSignals.filter((s) => s.supplierId === supplier.id);
    const avgCostOverrun = signals.reduce((sum, s) => sum + s.costOverrunProbability, 0) / signals.length;
    return { name: supplier.name.slice(0, 10), probability: Math.round(avgCostOverrun), region: supplier.region };
  });

  // Risk Distribution
  const riskDistribution = [
    { range: "0-20 (Low)", count: predictiveSignals.filter((s) => s.riskScore <= 20).length, fill: "hsl(var(--rag-green))" },
    { range: "21-40", count: predictiveSignals.filter((s) => s.riskScore > 20 && s.riskScore <= 40).length, fill: "hsl(var(--chart-3))" },
    { range: "41-60 (Med)", count: predictiveSignals.filter((s) => s.riskScore > 40 && s.riskScore <= 60).length, fill: "hsl(var(--rag-amber))" },
    { range: "61-80", count: predictiveSignals.filter((s) => s.riskScore > 60 && s.riskScore <= 80).length, fill: "hsl(var(--chart-5))" },
    { range: "81-100 (High)", count: predictiveSignals.filter((s) => s.riskScore > 80).length, fill: "hsl(var(--rag-red))" },
  ];

  // EV Charger Failure Risk
  const evFailureRisk = suppliers.map((supplier) => {
    const signals = predictiveSignals.filter((s) => s.supplierId === supplier.id);
    const latestSignal = signals[signals.length - 1];
    return {
      name: supplier.name,
      probability: latestSignal?.evChargerFailureProbability || 0,
      riskScore: latestSignal?.riskScore || 0,
    };
  });

  // Work Order Volume Forecast
  const woVolumeForecast = months.map((month, index) => {
    const baseVolume = workOrders.length / 12;
    const seasonal = Math.sin((index / 12) * Math.PI * 2) * 10;
    const trend = index * 2;
    return {
      month,
      actual: Math.round(baseVolume + Math.random() * 15),
      predicted: Math.round(baseVolume + seasonal + trend),
      lower: Math.round(baseVolume + seasonal + trend - 8),
      upper: Math.round(baseVolume + seasonal + trend + 8),
    };
  });

  // Asset failure predictions
  const assetFailurePredictions = [
    { asset: "EV Charger", probability: 28, impact: "High", sites: 12, trend: "+5%" },
    { asset: "HVAC", probability: 22, impact: "Medium", sites: 8, trend: "+3%" },
    { asset: "Pump", probability: 15, impact: "High", sites: 5, trend: "-2%" },
    { asset: "ATG", probability: 12, impact: "Medium", sites: 4, trend: "0%" },
    { asset: "Refrigerator", probability: 18, impact: "Low", sites: 6, trend: "+1%" },
    { asset: "Lighting", probability: 8, impact: "Low", sites: 3, trend: "-1%" },
  ];

  // Scenario simulation
  const downtimeReduction = Math.round(responseReduction[0] * 0.8);
  const revenueProtection = Math.round(responseReduction[0] * 1500);
  const slaImprovement = Math.round(responseReduction[0] * 0.3);
  const customerSatisfaction = Math.round(responseReduction[0] * 0.5);

  // High risk suppliers
  const highRiskSuppliers = suppliers
    .map((supplier) => {
      const signals = predictiveSignals.filter((s) => s.supplierId === supplier.id);
      const latest = signals[signals.length - 1];
      const supplierKpis = kpis.filter(k => k.supplierId === supplier.id);
      const latestKpi = supplierKpis[supplierKpis.length - 1];
      return {
        ...supplier,
        riskScore: latest?.riskScore || 0,
        slaBreachProb: latest?.slaBreachProbability || 0,
        costOverrunProb: latest?.costOverrunProbability || 0,
        evFailureProb: latest?.evChargerFailureProbability || 0,
        currentSla: latestKpi?.slaCompliance || 0,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 6);

  return (
    <DashboardLayout
      title="Predictive Insights"
      subtitle="AI-powered forecasting and risk analysis"
    >
      <div className="space-y-6">
        {/* High Risk Suppliers */}
        <section>
          <SectionHeader
            title="High Risk Suppliers"
            subtitle="Suppliers requiring immediate attention"
            icon={AlertTriangle}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highRiskSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="bg-card rounded-xl border border-border/50 p-5 hover:border-border transition-all cursor-pointer hover-lift"
                onClick={() => navigate(`/suppliers/${supplier.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold">{supplier.name}</div>
                    <div className="text-xs text-muted-foreground">{supplier.region} • {supplier.serviceCategory}</div>
                  </div>
                  <RAGBadge
                    status={supplier.riskScore > 60 ? "red" : supplier.riskScore > 30 ? "amber" : "green"}
                    label={`Risk: ${supplier.riskScore}`}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current SLA</span>
                    <span className={supplier.currentSla < 85 ? "text-rag-red font-medium" : ""}>{supplier.currentSla}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SLA Breach Prob</span>
                    <span className={supplier.slaBreachProb > 30 ? "text-rag-red font-medium" : ""}>{supplier.slaBreachProb}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost Overrun Prob</span>
                    <span className={supplier.costOverrunProb > 30 ? "text-rag-amber font-medium" : ""}>{supplier.costOverrunProb}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">EV Failure Prob</span>
                    <span>{supplier.evFailureProb}%</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        supplier.riskScore > 60 ? "bg-rag-red" : supplier.riskScore > 30 ? "bg-rag-amber" : "bg-rag-green"
                      }`}
                      style={{ width: `${supplier.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Analytics Tabs */}
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-6">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="workload">Workload</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="simulator">Simulator</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Probability Trend */}
              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Risk Probability Trends</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={slaTrend}>
                      <defs>
                        <linearGradient id="slaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--rag-red))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--rag-red))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--rag-amber))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--rag-amber))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis domain={[0, 60]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="slaProb" name="SLA Breach" stroke="hsl(var(--rag-red))" fill="url(#slaGradient)" />
                      <Area type="monotone" dataKey="costProb" name="Cost Overrun" stroke="hsl(var(--rag-amber))" fill="url(#costGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <Gauge className="w-5 h-5 text-chart-4" />
                  <h3 className="font-semibold text-foreground">Supplier Risk Distribution</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={riskDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="range" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Overrun by Supplier */}
              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-chart-2" />
                  <h3 className="font-semibold text-foreground">Cost Overrun Probability by Supplier</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costForecast} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 60]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Probability"]}
                      />
                      <Bar dataKey="probability" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* EV Charger Scatter */}
              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-chart-3" />
                  <h3 className="font-semibold text-foreground">EV Charger Failure vs Risk Score</h3>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="riskScore" name="Risk Score" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis dataKey="probability" name="Failure Prob" domain={[0, 50]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <ZAxis range={[50, 200]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Scatter data={evFailureRisk} fill="hsl(var(--chart-3))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="workload" className="space-y-6">
            <div className="chart-container">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Work Order Volume Forecast</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={woVolumeForecast}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upper" stroke="transparent" fill="hsl(var(--primary))" fillOpacity={0.1} name="Upper Bound" />
                    <Area type="monotone" dataKey="lower" stroke="transparent" fill="hsl(var(--background))" name="Lower Bound" />
                    <Line type="monotone" dataKey="actual" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-chart-4" />
                  <h3 className="font-semibold text-foreground">Asset Failure Predictions</h3>
                </div>
                <div className="space-y-3">
                  {assetFailurePredictions.map((asset) => (
                    <div key={asset.asset} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{asset.asset}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            asset.impact === "High" ? "bg-rag-red/20 text-rag-red" :
                            asset.impact === "Medium" ? "bg-rag-amber/20 text-rag-amber" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {asset.impact} Impact
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              asset.probability > 20 ? "bg-rag-red" : asset.probability > 15 ? "bg-rag-amber" : "bg-rag-green"
                            }`}
                            style={{ width: `${asset.probability * 2}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{asset.probability}% failure prob</span>
                          <span>{asset.sites} sites affected</span>
                          <span className={asset.trend.startsWith("+") ? "text-rag-red" : asset.trend.startsWith("-") ? "text-rag-green" : ""}>
                            {asset.trend}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-container">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-chart-5" />
                  <h3 className="font-semibold text-foreground">30-Day Failure Forecast</h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetFailurePredictions}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="probability"
                        nameKey="asset"
                        label={({ asset, probability }) => `${asset}: ${probability}%`}
                        labelLine={false}
                      >
                        {assetFailurePredictions.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Scenario Simulator</h3>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Response Time Reduction: <span className="text-primary text-lg">{responseReduction[0]}%</span>
                  </label>
                  <Slider
                    value={responseReduction}
                    onValueChange={setResponseReduction}
                    max={50}
                    step={5}
                    className="mb-6"
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulate the impact of reducing average response time on key business metrics.
                    Adjust the slider to see projected improvements.
                  </p>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <h4 className="font-medium text-sm mb-2">How it works:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Faster response reduces equipment downtime</li>
                      <li>• Lower downtime improves SLA compliance</li>
                      <li>• Better SLA increases customer satisfaction</li>
                      <li>• Reduced downtime protects revenue</li>
                    </ul>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-rag-green/10 border border-rag-green/30">
                    <div className="text-3xl font-bold text-rag-green">{downtimeReduction}%</div>
                    <div className="text-sm text-muted-foreground">Downtime Reduction</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="text-3xl font-bold text-primary">£{revenueProtection.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Revenue Protected (Monthly)</div>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-2/10 border border-chart-2/30">
                    <div className="text-3xl font-bold text-chart-2">+{slaImprovement}%</div>
                    <div className="text-sm text-muted-foreground">SLA Improvement</div>
                  </div>
                  <div className="p-4 rounded-lg bg-chart-3/10 border border-chart-3/30">
                    <div className="text-3xl font-bold text-chart-3">+{customerSatisfaction}%</div>
                    <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
