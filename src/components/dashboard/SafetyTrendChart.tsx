import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { kpis } from "@/data/mockData";

export function SafetyTrendChart() {
  const months = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06",
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
  ];

  const data = months.map((month) => {
    const monthKpis = kpis.filter((k) => k.month === month);
    const totalIncidents = monthKpis.reduce((sum, k) => sum + k.safetyIncidents, 0);
    const totalNearMisses = monthKpis.reduce((sum, k) => sum + k.nearMisses, 0);
    const safetyScore = Math.max(0, 100 - totalIncidents * 5);

    return {
      month: month.slice(5),
      incidents: totalIncidents,
      nearMisses: totalNearMisses,
      safetyScore,
    };
  });

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Safety Performance Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="month"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar yAxisId="left" dataKey="incidents" name="Incidents" fill="hsl(var(--rag-red))" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="nearMisses" name="Near Misses" fill="hsl(var(--rag-amber))" radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="safetyScore"
              name="Safety Score"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
