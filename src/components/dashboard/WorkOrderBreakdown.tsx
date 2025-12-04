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

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Work Order Status</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {statusData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
