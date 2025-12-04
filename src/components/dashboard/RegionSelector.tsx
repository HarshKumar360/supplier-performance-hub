import { cn } from "@/lib/utils";
import { getRegionData } from "@/data/mockData";
import { Globe, MapPin } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}

const regionColors: Record<string, string> = {
  UK: "bg-chart-1",
  Germany: "bg-chart-2",
  Netherlands: "bg-chart-3",
  US: "bg-chart-4",
  ANZ: "bg-chart-5",
  "South Africa": "bg-primary",
};

export function RegionSelector({ selectedRegion, onSelectRegion }: RegionSelectorProps) {
  const regions = getRegionData();

  return (
    <div className="bg-card rounded-xl border border-border/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Regions</h3>
        <button
          onClick={() => onSelectRegion(null)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            !selectedRegion
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Globe className="w-4 h-4" />
          Global
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {regions.map((region) => (
          <button
            key={region.region}
            onClick={() => onSelectRegion(region.region)}
            className={cn(
              "p-4 rounded-lg border text-left transition-all hover:shadow-md",
              selectedRegion === region.region
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border/50 bg-background hover:border-border"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", regionColors[region.region])} />
              <span className="font-medium text-sm">{region.region}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>
                <span className="block font-semibold text-foreground text-lg">
                  {region.siteCount}
                </span>
                Sites
              </div>
              <div>
                <span className="block font-semibold text-foreground text-lg">
                  {region.supplierCount}
                </span>
                Suppliers
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{region.totalAssets} assets</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
