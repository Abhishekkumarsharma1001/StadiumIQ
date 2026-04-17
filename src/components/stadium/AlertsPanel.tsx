import { AlertTriangle, BellRing, CheckCircle2, Info } from "lucide-react";
import { Alert } from "@/hooks/useStadiumData";
import { cn } from "@/lib/utils";

interface Props {
  alerts: Alert[];
}

const ICONS = {
  critical: AlertTriangle,
  warning: BellRing,
  info: Info,
};

export function AlertsPanel({ alerts }: Props) {
  return (
    <div className="card-premium p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/15 text-destructive">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold">Live Alerts</h3>
            <p className="text-xs text-muted-foreground">Real-time stadium events</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-status-low animate-pulse-glow status-dot-low" />
          Live
        </span>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
        {alerts.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-status-low" />
            All clear — no active alerts
          </div>
        )}
        {alerts.map((a) => {
          const Icon = ICONS[a.severity];
          return (
            <div
              key={a.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 animate-slide-up",
                a.severity === "critical" && "border-status-high/30 bg-status-high/5",
                a.severity === "warning" && "border-status-medium/30 bg-status-medium/5",
                a.severity === "info" && "border-primary/20 bg-primary/5"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  a.severity === "critical" && "text-status-high",
                  a.severity === "warning" && "text-status-medium",
                  a.severity === "info" && "text-primary"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{a.message}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
