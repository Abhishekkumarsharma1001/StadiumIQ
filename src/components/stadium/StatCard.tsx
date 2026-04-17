import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "low" | "medium" | "high";
}

export function StatCard({ label, value, hint, icon: Icon, accent = "primary" }: Props) {
  return (
    <div className="card-premium p-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg",
            accent === "primary" && "bg-primary/15 text-primary",
            accent === "low" && "bg-status-low/15 text-status-low",
            accent === "medium" && "bg-status-medium/15 text-status-medium",
            accent === "high" && "bg-status-high/15 text-status-high"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
