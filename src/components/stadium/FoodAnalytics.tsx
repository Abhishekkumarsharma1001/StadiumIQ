import { Clock, Flame, Utensils } from "lucide-react";
import { FoodStall } from "@/hooks/useStadiumData";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface Props {
  stalls: FoodStall[];
}

export function FoodAnalytics({ stalls }: Props) {
  const sorted = [...stalls].sort((a, b) => a.waitTime - b.waitTime);
  const fastest = sorted[0];
  return (
    <div className="card-premium p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent/15 text-accent">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Food & Beverage</h3>
            <p className="text-xs text-muted-foreground">Sorted by shortest wait time</p>
          </div>
        </div>
      </div>
      <ul className="space-y-2">
        {sorted.map((s, i) => {
          const isFastest = s.id === fastest.id;
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-center justify-between rounded-lg border border-border/60 p-3 transition-colors",
                isFastest ? "border-status-low/40 bg-status-low/5" : "hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                  #{i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{s.name}</p>
                    {isFastest && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-status-low/15 px-2 py-0.5 text-[10px] font-semibold text-status-low">
                        <Flame className="h-3 w-3" /> Fastest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{s.cuisine}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge level={s.level} showLabel={false} />
                <div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-xs font-medium tabular-nums">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {s.waitTime}m
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
