import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { workOrders } from "@/data/mockData";
import { Zap, Fuel, Thermometer, Lightbulb, Wind, Car } from "lucide-react";

const assetIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "EV Charger": Zap,
  "Pump": Fuel,
  "HVAC": Thermometer,
  "Lighting": Lightbulb,
  "ATG": Wind,
  "Car Wash": Car,
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--rag-amber)",
  "var(--rag-green)",
];

export function AssetTypeBreakdown() {
  const assetCounts = workOrders.reduce((acc, wo) => {
    acc[wo.assetType] = (acc[wo.assetType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(assetCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Work Orders by Asset Type</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${COLORS[index % COLORS.length]})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {data.slice(0, 4).map((item, index) => {
          const Icon = assetIcons[item.name] || Zap;
          return (
            <div key={item.name} className="flex items-center gap-2 text-xs">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
