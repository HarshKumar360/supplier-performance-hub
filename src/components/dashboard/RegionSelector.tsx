import { cn } from "@/lib/utils";
import { getRegionData } from "@/data/mockData";
import { Globe, MapPin, Building2, Users } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}

const regionColors: Record<string, string> = {
  UK: "from-chart-1/20 to-chart-1/5",
  Germany: "from-chart-2/20 to-chart-2/5",
  Netherlands: "from-chart-3/20 to-chart-3/5",
  US: "from-chart-4/20 to-chart-4/5",
  ANZ: "from-chart-5/20 to-chart-5/5",
  "South Africa": "from-primary/20 to-primary/5",
};

const dotColors: Record<string, string> = {
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
    <div className="space-y-3">
      {/* Global Toggle */}
      <button
        onClick={() => onSelectRegion(null)}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
          !selectedRegion
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-card border border-border/40 text-muted-foreground hover:text-foreground hover:border-border/60"
        )}
      >
        <Globe className="w-4 h-4" />
        All Regions
      </button>

      {/* Region Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
        {regions.map((region) => (
          <button
            key={region.region}
            onClick={() => onSelectRegion(region.region)}
            className={cn(
              "relative overflow-hidden p-4 rounded-xl text-left transition-all duration-200 group",
              selectedRegion === region.region
                ? "bg-card border-2 border-primary shadow-md"
                : "bg-card border border-border/40 hover:border-border/60 hover:shadow-sm"
            )}
          >
            {/* Gradient background */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity",
                regionColors[region.region],
                selectedRegion === region.region ? "opacity-100" : "group-hover:opacity-50"
              )}
            />

            <div className="relative">
              {/* Region name */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2 h-2 rounded-full", dotColors[region.region])} />
                <span className="font-semibold text-sm text-foreground">{region.region}</span>
              </div>

              {/* Stats */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="w-3 h-3" />
                  <span className="font-medium text-foreground">{region.siteCount}</span>
                  <span>sites</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span className="font-medium text-foreground">{region.supplierCount}</span>
                  <span>suppliers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span className="font-medium text-foreground">{region.totalAssets.toLocaleString()}</span>
                  <span>assets</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
