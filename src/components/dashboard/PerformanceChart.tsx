import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { kpis, suppliers } from "@/data/mockData";

interface PerformanceChartProps {
  supplierId?: string;
}

export function PerformanceChart({ supplierId }: PerformanceChartProps) {
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];

  const data = months.map((month) => {
    const monthKpis = supplierId
      ? kpis.filter((k) => k.supplierId === supplierId && k.month === month)
      : kpis.filter((k) => k.month === month);

    const avgSla = monthKpis.reduce((sum, k) => sum + k.slaCompliance, 0) / monthKpis.length;
    const avgFtfr = monthKpis.reduce((sum, k) => sum + k.ftfr, 0) / monthKpis.length;

    return {
      month: month.slice(5),
      sla: Math.round(avgSla),
      ftfr: Math.round(avgFtfr),
    };
  });

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Performance Trends</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sla"
              name="SLA Compliance %"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
            />
            <Line
              type="monotone"
              dataKey="ftfr"
              name="FTFR %"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--chart-2))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
