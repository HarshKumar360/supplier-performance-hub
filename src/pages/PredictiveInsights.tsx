import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { predictiveSignals, suppliers } from "@/data/mockData";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
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
} from "recharts";
import { AlertTriangle, TrendingUp, Zap, DollarSign, Gauge } from "lucide-react";

export default function PredictiveInsights() {
  const [responseReduction, setResponseReduction] = useState([20]);

  // SLA Breach Probability over time
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const slaTrend = months.map((month) => {
    const monthSignals = predictiveSignals.filter((s) => s.month.endsWith(month));
    const avgProb = monthSignals.reduce((sum, s) => sum + s.slaBreachProbability, 0) / monthSignals.length;
    return { month, probability: Math.round(avgProb) };
  });

  // Cost Overrun Forecast
  const costForecast = suppliers.map((supplier) => {
    const signals = predictiveSignals.filter((s) => s.supplierId === supplier.id);
    const avgCostOverrun = signals.reduce((sum, s) => sum + s.costOverrunProbability, 0) / signals.length;
    return { name: supplier.name.slice(0, 10), probability: Math.round(avgCostOverrun) };
  });

  // Risk Distribution
  const riskDistribution = [
    { range: "0-20", count: predictiveSignals.filter((s) => s.riskScore <= 20).length },
    { range: "21-40", count: predictiveSignals.filter((s) => s.riskScore > 20 && s.riskScore <= 40).length },
    { range: "41-60", count: predictiveSignals.filter((s) => s.riskScore > 40 && s.riskScore <= 60).length },
    { range: "61-80", count: predictiveSignals.filter((s) => s.riskScore > 60 && s.riskScore <= 80).length },
    { range: "81-100", count: predictiveSignals.filter((s) => s.riskScore > 80).length },
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

  // Scenario simulation
  const downtimeReduction = Math.round(responseReduction[0] * 0.8);
  const revenueProtection = Math.round(responseReduction[0] * 1500);

  // High risk suppliers
  const highRiskSuppliers = suppliers
    .map((supplier) => {
      const signals = predictiveSignals.filter((s) => s.supplierId === supplier.id);
      const latest = signals[signals.length - 1];
      return {
        ...supplier,
        riskScore: latest?.riskScore || 0,
        slaBreachProb: latest?.slaBreachProbability || 0,
        costOverrunProb: latest?.costOverrunProbability || 0,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);

  return (
    <DashboardLayout
      title="Predictive Insights"
      subtitle="AI-powered forecasting and risk analysis"
    >
      <div className="space-y-6">
        {/* High Risk Suppliers */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-rag-amber" />
            <h3 className="font-semibold text-foreground">High Risk Suppliers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {highRiskSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm">{supplier.name}</div>
                  <RAGBadge
                    status={
                      supplier.riskScore > 60
                        ? "red"
                        : supplier.riskScore > 30
                        ? "amber"
                        : "green"
                    }
                    size="sm"
                  />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className="font-semibold">{supplier.riskScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SLA Breach Prob</span>
                    <span className={supplier.slaBreachProb > 30 ? "text-rag-red" : ""}>
                      {supplier.slaBreachProb}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Overrun</span>
                    <span className={supplier.costOverrunProb > 30 ? "text-rag-amber" : ""}>
                      {supplier.costOverrunProb}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SLA Breach Probability Trend */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">SLA Breach Probability Trend</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={slaTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis domain={[0, 50]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Probability"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    stroke="hsl(var(--rag-red))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--rag-red))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cost Overrun Forecast */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-chart-2" />
              <h3 className="font-semibold text-foreground">Cost Overrun Forecast by Supplier</h3>
            </div>
            <div className="h-64">
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

          {/* Risk Distribution */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-chart-4" />
              <h3 className="font-semibold text-foreground">Supplier Risk Distribution</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* EV Charger Failure Prediction */}
          <div className="chart-container">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-chart-3" />
              <h3 className="font-semibold text-foreground">EV Charger Failure Prediction</h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="riskScore"
                    name="Risk Score"
                    domain={[0, 100]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="probability"
                    name="Failure Prob"
                    domain={[0, 50]}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <ZAxis range={[50, 200]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                  <Scatter data={evFailureRisk} fill="hsl(var(--chart-3))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Scenario Simulator */}
        <div className="bg-card rounded-xl border border-border/50 p-6">
          <h3 className="font-semibold text-foreground mb-6">Scenario Simulator</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-4">
                Response Time Reduction: <span className="text-primary">{responseReduction[0]}%</span>
              </label>
              <Slider
                value={responseReduction}
                onValueChange={setResponseReduction}
                max={50}
                step={5}
                className="mb-6"
              />
              <p className="text-sm text-muted-foreground">
                Adjust the slider to simulate the impact of reducing average response time on
                downtime and revenue.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-rag-green/10 border border-rag-green/30">
                <div className="text-2xl font-bold text-rag-green">{downtimeReduction}%</div>
                <div className="text-sm text-muted-foreground">Expected Downtime Reduction</div>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div className="text-2xl font-bold text-primary">£{revenueProtection.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Revenue Protection (Monthly)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
