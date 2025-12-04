import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RAGBadge } from "@/components/dashboard/RAGBadge";
import { getSupplierPerformance, suppliers } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronRight, Filter } from "lucide-react";

export default function SupplierList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const performance = getSupplierPerformance();

  const filteredSuppliers = performance.filter((p) => {
    const matchesSearch = p.supplierName.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === "all" || p.region === regionFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const regions = [...new Set(suppliers.map((s) => s.region))];

  return (
    <DashboardLayout
      title="Supplier Deep Dive"
      subtitle="Analyse individual supplier performance"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border/50 p-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="green">Good</SelectItem>
                  <SelectItem value="amber">Warning</SelectItem>
                  <SelectItem value="red">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Supplier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => {
            const supplierData = suppliers.find((s) => s.id === supplier.supplierId);
            return (
              <div
                key={supplier.supplierId}
                onClick={() => navigate(`/suppliers/${supplier.supplierId}`)}
                className="bg-card rounded-xl border border-border/50 p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {supplier.supplierName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{supplier.region}</p>
                  </div>
                  <RAGBadge status={supplier.status} size="sm" />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xl font-bold text-foreground">{supplier.slaCompliance}%</div>
                    <div className="text-xs text-muted-foreground">SLA</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{supplier.ftfr}%</div>
                    <div className="text-xs text-muted-foreground">FTFR</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">{supplier.performanceScore}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                      {supplierData?.serviceCategory}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                      {supplierData?.slaLevel}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No suppliers match your filters
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
