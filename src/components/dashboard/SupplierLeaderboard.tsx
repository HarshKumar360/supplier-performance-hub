import { useNavigate } from "react-router-dom";
import { RAGBadge } from "./RAGBadge";
import { getSupplierPerformance } from "@/data/mockData";
import { ChevronRight, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export function SupplierLeaderboard() {
  const navigate = useNavigate();
  const suppliers = getSupplierPerformance().sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (index === 1) return <Medal className="w-4 h-4 text-gray-400" />;
    if (index === 2) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-muted-foreground font-medium">{index + 1}</span>;
  };

  return (
    <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left font-medium text-muted-foreground py-3.5 px-4 w-14">#</th>
              <th className="text-left font-medium text-muted-foreground py-3.5 px-4">Supplier</th>
              <th className="text-center font-medium text-muted-foreground py-3.5 px-4">SLA</th>
              <th className="text-center font-medium text-muted-foreground py-3.5 px-4">FTFR</th>
              <th className="text-right font-medium text-muted-foreground py-3.5 px-4">Cost/Job</th>
              <th className="text-center font-medium text-muted-foreground py-3.5 px-4">Risk</th>
              <th className="text-center font-medium text-muted-foreground py-3.5 px-4">Score</th>
              <th className="text-center font-medium text-muted-foreground py-3.5 px-4">Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.slice(0, 8).map((supplier, index) => (
              <tr
                key={supplier.supplierId}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:bg-muted/50 group",
                  index === 0 && "bg-yellow-500/5"
                )}
                onClick={() => navigate(`/suppliers/${supplier.supplierId}`)}
              >
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/50">
                    {getRankBadge(index)}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div>
                    <p className="font-medium text-foreground">{supplier.supplierName}</p>
                    <p className="text-xs text-muted-foreground">{supplier.region}</p>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-12 h-7 rounded-md text-xs font-semibold",
                      supplier.slaCompliance >= 90
                        ? "bg-rag-green/10 text-rag-green"
                        : supplier.slaCompliance >= 80
                        ? "bg-rag-amber/10 text-rag-amber"
                        : "bg-rag-red/10 text-rag-red"
                    )}
                  >
                    {supplier.slaCompliance}%
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-12 h-7 rounded-md text-xs font-semibold",
                      supplier.ftfr >= 80
                        ? "bg-rag-green/10 text-rag-green"
                        : supplier.ftfr >= 70
                        ? "bg-rag-amber/10 text-rag-amber"
                        : "bg-rag-red/10 text-rag-red"
                    )}
                  >
                    {supplier.ftfr}%
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-foreground">
                  £{supplier.costPerJob.toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center">
                    <div className="w-14 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          supplier.riskScore <= 30
                            ? "bg-rag-green"
                            : supplier.riskScore <= 60
                            ? "bg-rag-amber"
                            : "bg-rag-red"
                        )}
                        style={{ width: `${supplier.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="text-lg font-bold text-foreground">{supplier.performanceScore}</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <RAGBadge status={supplier.status} size="sm" />
                </td>
                <td className="py-3.5 px-4">
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
