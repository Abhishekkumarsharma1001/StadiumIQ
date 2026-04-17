import { useEffect, useState } from "react";

export type CrowdLevel = "low" | "medium" | "high";

export interface Zone {
  id: string;
  name: string;
  type: "gate" | "block";
  density: number; // 0-100
  level: CrowdLevel;
  capacity: number;
  current: number;
}

export interface FoodStall {
  id: string;
  name: string;
  cuisine: string;
  waitTime: number;
  level: CrowdLevel;
}

export interface Alert {
  id: string;
  message: string;
  severity: "info" | "warning" | "critical";
  time: string;
}

const levelFromDensity = (d: number): CrowdLevel =>
  d < 40 ? "low" : d < 75 ? "medium" : "high";

const baseZones: Omit<Zone, "density" | "level" | "current">[] = [
  { id: "gate-a", name: "Gate A", type: "gate", capacity: 1200 },
  { id: "gate-b", name: "Gate B", type: "gate", capacity: 1200 },
  { id: "gate-c", name: "Gate C", type: "gate", capacity: 1000 },
  { id: "gate-d", name: "Gate D", type: "gate", capacity: 1000 },
  { id: "block-n", name: "Block North", type: "block", capacity: 5000 },
  { id: "block-s", name: "Block South", type: "block", capacity: 5000 },
  { id: "block-e", name: "Block East", type: "block", capacity: 4000 },
  { id: "block-w", name: "Block West", type: "block", capacity: 4000 },
];

const baseStalls: Omit<FoodStall, "waitTime" | "level">[] = [
  { id: "s1", name: "Pitch Side Pizza", cuisine: "Italian" },
  { id: "s2", name: "MVP Burgers", cuisine: "American" },
  { id: "s3", name: "Goal Tacos", cuisine: "Mexican" },
  { id: "s4", name: "Champion Coffee", cuisine: "Cafe" },
  { id: "s5", name: "Dugout Donuts", cuisine: "Bakery" },
  { id: "s6", name: "Penalty Noodles", cuisine: "Asian" },
];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateZones(): Zone[] {
  return baseZones.map((z) => {
    const density = rand(15, 95);
    return {
      ...z,
      density,
      level: levelFromDensity(density),
      current: Math.floor((density / 100) * z.capacity),
    };
  });
}

function generateStalls(): FoodStall[] {
  return baseStalls.map((s) => {
    const wait = rand(1, 25);
    return { ...s, waitTime: wait, level: levelFromDensity(wait * 4) };
  });
}

const ALERT_TEMPLATES = [
  { severity: "critical" as const, fn: (z: Zone) => `${z.name} is overcrowded — redirect traffic` },
  { severity: "warning" as const, fn: (z: Zone) => `Rising congestion detected at ${z.name}` },
  { severity: "info" as const, fn: (z: Zone) => `${z.name} cleared — flow normal` },
  { severity: "info" as const, fn: (z: Zone) => `Use ${z.name} for the fastest entry` },
];

function generateAlerts(zones: Zone[]): Alert[] {
  const high = zones.filter((z) => z.level === "high");
  const low = zones.filter((z) => z.type === "gate" && z.level === "low");
  const items: Alert[] = [];
  high.slice(0, 2).forEach((z, i) =>
    items.push({
      id: `a-${z.id}-${Date.now()}-${i}`,
      message: ALERT_TEMPLATES[0].fn(z),
      severity: "critical",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    })
  );
  low.slice(0, 1).forEach((z, i) =>
    items.push({
      id: `b-${z.id}-${Date.now()}-${i}`,
      message: ALERT_TEMPLATES[3].fn(z),
      severity: "info",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    })
  );
  zones
    .filter((z) => z.level === "medium")
    .slice(0, 1)
    .forEach((z, i) =>
      items.push({
        id: `c-${z.id}-${Date.now()}-${i}`,
        message: ALERT_TEMPLATES[1].fn(z),
        severity: "warning",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      })
    );
  return items;
}

export function useStadiumData(intervalMs = 3000) {
  const [zones, setZones] = useState<Zone[]>(() => generateZones());
  const [stalls, setStalls] = useState<FoodStall[]>(() => generateStalls());
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts(generateZones()));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const z = generateZones();
      setZones(z);
      setStalls(generateStalls());
      setAlerts(generateAlerts(z));
      setTick((t) => t + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { zones, stalls, alerts, tick };
}
