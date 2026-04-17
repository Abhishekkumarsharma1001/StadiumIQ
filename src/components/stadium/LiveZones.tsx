import { DoorOpen, Users } from "lucide-react";
import { Zone } from "@/hooks/useStadiumData";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface Props {
  zones: Zone[];
  recommendedId?: string;
}

export function LiveZones({ zones, recommendedId }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {zones.map((z) => {
        const recommended = z.id === recommendedId;
        return (
          <div
            key={z.id}
            className={cn(
              "card-premium p-4 animate-fade-in relative overflow-hidden",
              recommended && "border-primary/60 glow-primary"
            )}
          >
            {recommended && (
              <div className="absolute right-2 top-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                BEST
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <DoorOpen className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">{z.type}</span>
            </div>
            <h3 className="mt-1 text-lg font-semibold">{z.name}</h3>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge level={z.level} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {z.current.toLocaleString()}
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  z.level === "low" && "bg-status-low",
                  z.level === "medium" && "bg-status-medium",
                  z.level === "high" && "bg-status-high"
                )}
                style={{ width: `${z.density}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[10px] text-muted-foreground">{z.density}% density</div>
          </div>
        );
      })}
    </div>
  );
}
