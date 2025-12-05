import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { kpis, suppliers } from "@/data/mockData";

interface AreaTrendChartProps {
  metric?: "sla" | "ftfr" | "cost";
  title?: string;
}

export function AreaTrendChart({ metric = "sla", title }: AreaTrendChartProps) {
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];

  const data = months.map((month) => {
    const monthKpis = kpis.filter((k) => k.month === month);
    const avgSla = monthKpis.reduce((sum, k) => sum + k.slaCompliance, 0) / monthKpis.length;
    const avgFtfr = monthKpis.reduce((sum, k) => sum + k.ftfr, 0) / monthKpis.length;
    const avgCost = monthKpis.reduce((sum, k) => sum + k.costPerJob, 0) / monthKpis.length;

    return {
      month: month.slice(5),
      sla: Math.round(avgSla),
      ftfr: Math.round(avgFtfr),
      cost: Math.round(avgCost),
      target: metric === "sla" ? 90 : metric === "ftfr" ? 80 : 1000,
    };
  });

  const metricConfig = {
    sla: { name: "SLA Compliance", color: "var(--chart-1)", unit: "%" },
    ftfr: { name: "First Time Fix Rate", color: "var(--chart-2)", unit: "%" },
    cost: { name: "Cost per Job", color: "var(--chart-3)", unit: "£" },
  };

  const config = metricConfig[metric];

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">{title || config.name} Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`hsl(${config.color})`} stopOpacity={0.3} />
                <stop offset="95%" stopColor={`hsl(${config.color})`} stopOpacity={0} />
              </linearGradient>
            </defs>
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
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${config.unit === "£" ? "£" : ""}${value}${config.unit === "%" ? "%" : ""}`, config.name]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey={metric}
              name={config.name}
              stroke={`hsl(${config.color})`}
              strokeWidth={2}
              fill={`url(#gradient-${metric})`}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
