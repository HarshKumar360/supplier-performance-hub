import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { workOrders } from "@/data/mockData";

interface WorkOrderBreakdownProps {
  supplierId?: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function WorkOrderBreakdown({ supplierId }: WorkOrderBreakdownProps) {
  const filteredWOs = supplierId
    ? workOrders.filter((wo) => wo.supplierId === supplierId)
    : workOrders;

  const statusData = [
    { name: "Open", value: filteredWOs.filter((wo) => wo.status === "Open").length },
    { name: "Closed", value: filteredWOs.filter((wo) => wo.status === "Closed").length },
    { name: "Delayed", value: filteredWOs.filter((wo) => wo.status === "Delayed").length },
    { name: "Overdue", value: filteredWOs.filter((wo) => wo.status === "Overdue").length },
  ];

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-2xl border border-border/40 p-6 h-full">
      <div className="h-72 flex flex-col">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {statusData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-muted-foreground">{item.name}</span>
              <span className="text-xs font-medium text-foreground ml-auto">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
