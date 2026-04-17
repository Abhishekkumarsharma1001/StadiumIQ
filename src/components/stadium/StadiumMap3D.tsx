import { useState } from "react";
import { Users, DoorOpen, Activity, X } from "lucide-react";
import { Zone } from "@/hooks/useStadiumData";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
  zones: Zone[];
}

// Map zone IDs to SVG shape definitions (isometric-ish stadium)
type ShapeType = "block" | "gate";
interface ShapeDef {
  id: string;
  type: ShapeType;
  // polygon points for the visible top face
  points: string;
  // optional side face (extrusion) points for 3D depth
  side?: string;
  labelX: number;
  labelY: number;
}

const SHAPES: ShapeDef[] = [
  // Seating blocks (trapezoids around the pitch) — 3D extruded
  // Block North (top)
  {
    id: "block-n",
    type: "block",
    points: "180,90 620,90 540,160 260,160",
    side: "180,90 620,90 620,100 180,100",
    labelX: 400,
    labelY: 130,
  },
  // Block South (bottom)
  {
    id: "block-s",
    type: "block",
    points: "260,340 540,340 620,410 180,410",
    side: "180,410 620,410 620,420 180,420",
    labelX: 400,
    labelY: 380,
  },
  // Block West (left)
  {
    id: "block-w",
    type: "block",
    points: "180,90 260,160 260,340 180,410",
    side: "180,90 180,410 190,420 190,100",
    labelX: 215,
    labelY: 250,
  },
  // Block East (right)
  {
    id: "block-e",
    type: "block",
    points: "620,90 620,410 540,340 540,160",
    side: "620,90 620,410 630,420 630,100",
    labelX: 585,
    labelY: 250,
  },
  // Gates (small platforms at corners/edges)
  { id: "gate-a", type: "gate", points: "60,60 140,60 140,110 60,110", side: "60,110 140,110 140,120 60,120", labelX: 100, labelY: 90 },
  { id: "gate-b", type: "gate", points: "660,60 740,60 740,110 660,110", side: "660,110 740,110 740,120 660,120", labelX: 700, labelY: 90 },
  { id: "gate-c", type: "gate", points: "60,390 140,390 140,440 60,440", side: "60,440 140,440 140,450 60,450", labelX: 100, labelY: 420 },
  { id: "gate-d", type: "gate", points: "660,390 740,390 740,440 660,440", side: "660,440 740,440 740,450 660,450", labelX: 700, labelY: 420 },
];

const levelFill = (level: Zone["level"], hover: boolean) => {
  const opacity = hover ? "0.95" : "0.75";
  if (level === "low") return `hsl(var(--status-low) / ${opacity})`;
  if (level === "medium") return `hsl(var(--status-medium) / ${opacity})`;
  return `hsl(var(--status-high) / ${opacity})`;
};

export function StadiumMap3D({ zones }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const zoneById = (id: string) => zones.find((z) => z.id === id);
  const selected = selectedId ? zoneById(selectedId) : null;

  return (
    <div className="card-premium p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Stadium Map</h3>
          <p className="text-xs text-muted-foreground">
            Tap a zone to inspect live density
          </p>
        </div>
        <div className="hidden items-center gap-3 text-[10px] text-muted-foreground sm:flex">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-status-low" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-status-medium" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-status-high" /> High
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
        {/* Map */}
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-muted/30 to-background">
          <svg
            viewBox="0 0 800 500"
            className="h-auto w-full"
            role="img"
            aria-label="Interactive stadium map"
          >
            <defs>
              <radialGradient id="pitchGradient" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="hsl(var(--status-low) / 0.45)" />
                <stop offset="100%" stopColor="hsl(var(--status-low) / 0.15)" />
              </radialGradient>
              <linearGradient id="fieldShine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--foreground) / 0.05)" />
                <stop offset="100%" stopColor="hsl(var(--foreground) / 0)" />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="0" dy="4" result="off" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.4" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer field shadow */}
            <ellipse cx="400" cy="260" rx="320" ry="190" fill="hsl(var(--background))" opacity="0.4" />

            {/* Pitch */}
            <g filter="url(#softShadow)">
              <rect x="280" y="180" width="240" height="140" rx="10" fill="url(#pitchGradient)" stroke="hsl(var(--foreground) / 0.25)" strokeWidth="1.5" />
              <line x1="400" y1="180" x2="400" y2="320" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="1" />
              <circle cx="400" cy="250" r="22" fill="none" stroke="hsl(var(--foreground) / 0.3)" strokeWidth="1" />
              <rect x="280" y="180" width="240" height="140" rx="10" fill="url(#fieldShine)" />
            </g>

            {/* Zones */}
            {SHAPES.map((s) => {
              const z = zoneById(s.id);
              if (!z) return null;
              const isHover = hoverId === s.id;
              const isSelected = selectedId === s.id;
              return (
                <g
                  key={s.id}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ transformOrigin: `${s.labelX}px ${s.labelY}px`, transform: isHover ? "translateY(-2px)" : undefined }}
                  onMouseEnter={() => setHoverId(s.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => setSelectedId(s.id)}
                >
                  {s.side && (
                    <polygon
                      points={s.side}
                      fill="hsl(var(--background))"
                      opacity="0.6"
                    />
                  )}
                  <polygon
                    points={s.points}
                    fill={levelFill(z.level, isHover || isSelected)}
                    stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.25)"}
                    strokeWidth={isSelected ? 2.5 : 1}
                    style={{
                      filter: isSelected ? "drop-shadow(0 0 12px hsl(var(--primary) / 0.6))" : undefined,
                      transition: "all 200ms ease",
                    }}
                  />
                  <text
                    x={s.labelX}
                    y={s.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: s.type === "gate" ? 11 : 13,
                      fontWeight: 600,
                      fill: "hsl(var(--foreground))",
                    }}
                  >
                    {z.name}
                  </text>
                  <text
                    x={s.labelX}
                    y={s.labelY + (s.type === "gate" ? 14 : 16)}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    style={{ fontSize: 10, fill: "hsl(var(--foreground) / 0.7)" }}
                  >
                    {z.density}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side panel */}
        <aside className="rounded-xl border border-border/60 bg-card/40 p-4">
          {selected ? (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {selected.type === "gate" ? "Entry Gate" : "Seating Block"}
                  </p>
                  <h4 className="text-xl font-bold">{selected.name}</h4>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close details"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <StatusBadge level={selected.level} />

              <div className="space-y-3 rounded-lg bg-muted/40 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" /> Attendance
                  </span>
                  <span className="font-semibold">
                    {selected.current.toLocaleString()} / {selected.capacity.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" /> Density
                  </span>
                  <span className="font-semibold">{selected.density}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      selected.level === "low" && "bg-status-low",
                      selected.level === "medium" && "bg-status-medium",
                      selected.level === "high" && "bg-status-high"
                    )}
                    style={{ width: `${selected.density}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
                {selected.level === "high" && (
                  <>⚠️ Heavy congestion — consider redirecting to a low-density {selected.type === "gate" ? "gate" : "block access"}.</>
                )}
                {selected.level === "medium" && (
                  <>Flow is steady. Monitor over the next few minutes for changes.</>
                )}
                {selected.level === "low" && (
                  <>✓ Optimal flow. Recommended for {selected.type === "gate" ? "fast entry" : "smooth access"}.</>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
              <DoorOpen className="mb-2 h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm font-medium">Select a zone</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click any gate or block on the map to see live metrics.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
