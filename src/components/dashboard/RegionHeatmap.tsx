import { getRegionData } from "@/data/mockData";
import { cn } from "@/lib/utils";

export function RegionHeatmap() {
  const regionData = getRegionData();

  const maxWOs = Math.max(...regionData.map(r => r.openWOs));

  const getHeatColor = (value: number) => {
    const ratio = value / maxWOs;
    if (ratio > 0.7) return "bg-rag-red/20 border-rag-red/40";
    if (ratio > 0.4) return "bg-rag-amber/20 border-rag-amber/40";
    return "bg-rag-green/20 border-rag-green/40";
  };

  return (
    <div className="chart-container">
      <h3 className="font-semibold text-foreground mb-4">Regional Activity Heatmap</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {regionData.map((region) => (
          <div
            key={region.region}
            className={cn(
              "p-4 rounded-xl border-2 transition-all hover:scale-[1.02]",
              getHeatColor(region.openWOs)
            )}
          >
            <div className="font-semibold text-sm text-foreground">{region.region}</div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open WOs</span>
                <span className="font-medium">{region.openWOs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sites</span>
                <span className="font-medium">{region.siteCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Suppliers</span>
                <span className="font-medium">{region.supplierCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assets</span>
                <span className="font-medium">{region.totalAssets.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
