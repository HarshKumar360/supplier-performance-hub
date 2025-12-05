import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { kpis, suppliers } from "@/data/mockData";

interface CostAnalysisChartProps {
  showRegions?: boolean;
}

export function CostAnalysisChart({ showRegions = false }: CostAnalysisChartProps) {
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];

  const regions = ["UK", "Germany", "Netherlands", "US"];

  const data = months.map((month) => {
    const monthKpis = kpis.filter((k) => k.month === month);
    const avgCost = monthKpis.reduce((sum, k) => sum + k.costPerJob, 0) / monthKpis.length;

    const regionCosts: Record<string, number> = {};
    if (showRegions) {
      regions.forEach((region) => {
        const regionSupplierIds = suppliers.filter((s) => s.region === region).map((s) => s.id);
        const regionKpis = monthKpis.filter((k) => regionSupplierIds.includes(k.supplierId));
        if (regionKpis.length > 0) {
          regionCosts[region] = Math.round(regionKpis.reduce((sum, k) => sum + k.costPerJob, 0) / regionKpis.length);
        }
      });
    }

    return {
      month: month.slice(5),
      average: Math.round(avgCost),
      budget: 1200,
      ...regionCosts,
    };
  });

  const colors = {
    UK: "var(--chart-1)",
    Germany: "var(--chart-2)",
    Netherlands: "var(--chart-3)",
    US: "var(--chart-4)",
  };

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Cost per Job Analysis</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
              tickFormatter={(value) => `£${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
              formatter={(value: number) => [`£${value}`, ""]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <ReferenceLine
              y={1200}
              stroke="hsl(var(--rag-amber))"
              strokeDasharray="5 5"
              label={{ value: "Budget", fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            />
            {showRegions ? (
              regions.map((region) => (
                <Line
                  key={region}
                  type="monotone"
                  dataKey={region}
                  name={region}
                  stroke={`hsl(${colors[region as keyof typeof colors]})`}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))
            ) : (
              <Line
                type="monotone"
                dataKey="average"
                name="Avg Cost"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
