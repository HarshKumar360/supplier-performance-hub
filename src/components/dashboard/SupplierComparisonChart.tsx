import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getSupplierPerformance } from "@/data/mockData";

export function SupplierComparisonChart() {
  const performance = getSupplierPerformance()
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 8);

  const data = performance.map((p) => ({
    name: p.supplierName.length > 10 ? p.supplierName.slice(0, 10) + "..." : p.supplierName,
    sla: p.slaCompliance,
    ftfr: p.ftfr,
    score: p.performanceScore,
  }));

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Supplier Performance Comparison</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
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
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "16px" }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="sla" name="SLA %" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ftfr" name="FTFR %" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
