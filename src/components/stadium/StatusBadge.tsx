import type { CrowdLevel } from "@/hooks/useStadiumData";
import { cn } from "@/lib/utils";

interface Props {
  level: CrowdLevel;
  className?: string;
  showLabel?: boolean;
}

const LABELS: Record<CrowdLevel, string> = { low: "Low", medium: "Medium", high: "High" };

export function StatusBadge({ level, className, showLabel = true }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium", className,
      level === "low" && "border-status-low/30 bg-status-low/10 text-status-low",
      level === "medium" && "border-status-medium/30 bg-status-medium/10 text-status-medium",
      level === "high" && "border-status-high/30 bg-status-high/10 text-status-high",
    )}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse-glow",
          level === "low" && "status-dot-low",
          level === "medium" && "status-dot-medium",
          level === "high" && "status-dot-high",
        )}
      />
      {showLabel && <span>{LABELS[level]}</span>}
    </div>
  );
}
