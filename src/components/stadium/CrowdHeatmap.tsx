import { useMemo } from "react";
import { Zone } from "@/hooks/useStadiumData";
import { cn } from "@/lib/utils";

interface Props {
  zones: Zone[];
}

// Build a deterministic 12x8 grid; cells get color based on nearest zone density
export function CrowdHeatmap({ zones }: Props) {
  const cols = 14;
  const rows = 8;
  const cells = useMemo(() => {
    const arr: { intensity: number; key: string }[] = [];
    const avg = zones.reduce((s, z) => s + z.density, 0) / Math.max(zones.length, 1);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Combine pseudo-noise with avg density and zone influence
        const zoneIdx = (r * cols + c) % zones.length;
        const z = zones[zoneIdx];
        const noise = (Math.sin(r * 1.7 + c * 0.9) + 1) / 2; // 0..1
        const intensity = Math.min(100, Math.max(5, z.density * 0.6 + avg * 0.2 + noise * 25));
        arr.push({ intensity, key: `${r}-${c}` });
      }
    }
    return arr;
  }, [zones]);

  return (
    <div className="card-premium p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Crowd Heatmap</h3>
          <p className="text-xs text-muted-foreground">Live density across stadium concourse</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-status-low" />Low</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-status-medium" />Med</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-status-high" />High</span>
        </div>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => {
          const lvl = cell.intensity < 40 ? "low" : cell.intensity < 75 ? "medium" : "high";
          return (
            <div
              key={cell.key}
              className={cn(
                "aspect-square rounded-sm transition-all duration-700",
                lvl === "low" && "bg-status-low/30",
                lvl === "medium" && "bg-status-medium/40",
                lvl === "high" && "bg-status-high/60"
              )}
              style={{ opacity: 0.35 + (cell.intensity / 100) * 0.65 }}
            />
          );
        })}
      </div>
    </div>
  );
}
