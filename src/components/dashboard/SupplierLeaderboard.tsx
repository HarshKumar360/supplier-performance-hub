import { useNavigate } from "react-router-dom";
import { RAGBadge } from "./RAGBadge";
import { getSupplierPerformance } from "@/data/mockData";
import { ArrowUpRight, ChevronRight } from "lucide-react";

export function SupplierLeaderboard() {
  const navigate = useNavigate();
  const suppliers = getSupplierPerformance().sort(
    (a, b) => b.performanceScore - a.performanceScore
  );

  return (
    <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Supplier Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Performance ranking by composite score</p>
          </div>
          <button
            onClick={() => navigate("/suppliers")}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr className="bg-muted/30">
              <th className="w-12">#</th>
              <th>Supplier</th>
              <th>Region</th>
              <th className="text-center">SLA %</th>
              <th className="text-center">FTFR %</th>
              <th className="text-right">Cost/Job</th>
              <th className="text-center">Safety</th>
              <th className="text-center">Risk</th>
              <th className="text-center">Score</th>
              <th className="text-center">Status</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.slice(0, 10).map((supplier, index) => (
              <tr
                key={supplier.supplierId}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/suppliers/${supplier.supplierId}`)}
              >
                <td className="font-medium text-muted-foreground">{index + 1}</td>
                <td className="font-medium">{supplier.supplierName}</td>
                <td className="text-muted-foreground">{supplier.region}</td>
                <td className="text-center">
                  <span
                    className={
                      supplier.slaCompliance >= 90
                        ? "text-rag-green"
                        : supplier.slaCompliance >= 80
                        ? "text-rag-amber"
                        : "text-rag-red"
                    }
                  >
                    {supplier.slaCompliance}%
                  </span>
                </td>
                <td className="text-center">
                  <span
                    className={
                      supplier.ftfr >= 80
                        ? "text-rag-green"
                        : supplier.ftfr >= 70
                        ? "text-rag-amber"
                        : "text-rag-red"
                    }
                  >
                    {supplier.ftfr}%
                  </span>
                </td>
                <td className="text-right">£{supplier.costPerJob.toLocaleString()}</td>
                <td className="text-center">
                  <span
                    className={
                      supplier.safetyIncidents === 0
                        ? "text-rag-green"
                        : supplier.safetyIncidents <= 3
                        ? "text-rag-amber"
                        : "text-rag-red"
                    }
                  >
                    {supplier.safetyIncidents}
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          supplier.riskScore <= 30
                            ? "bg-rag-green"
                            : supplier.riskScore <= 60
                            ? "bg-rag-amber"
                            : "bg-rag-red"
                        }`}
                        style={{ width: `${supplier.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="text-center font-semibold">{supplier.performanceScore}</td>
                <td className="text-center">
                  <RAGBadge status={supplier.status} size="sm" />
                </td>
                <td>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
