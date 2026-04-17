import { useMemo } from "react";
import { Activity, DoorOpen, Users, Timer } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/stadium/AppSidebar";
import { useStadiumData } from "@/hooks/useStadiumData";
import { StatCard } from "@/components/stadium/StatCard";
import { LiveZones } from "@/components/stadium/LiveZones";
import { GateRecommendation } from "@/components/stadium/GateRecommendation";
import { FoodAnalytics } from "@/components/stadium/FoodAnalytics";
import { NavigationAssistant } from "@/components/stadium/NavigationAssistant";
import { AlertsPanel } from "@/components/stadium/AlertsPanel";
import { CrowdHeatmap } from "@/components/stadium/CrowdHeatmap";
import { StadiumMap3D } from "@/components/stadium/StadiumMap3D";
import { ChatbotWidget } from "@/components/stadium/ChatbotWidget";
import { QrEntryButton } from "@/components/stadium/QrEntryButton";

const Index = () => {
  const { zones, stalls, alerts, tick } = useStadiumData(3000);

  const recommendedGate = useMemo(
    () => zones.filter((z) => z.type === "gate").sort((a, b) => a.density - b.density)[0],
    [zones]
  );

  const totalAttendance = zones.reduce((s, z) => s + z.current, 0);
  const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);
  const avgWait = Math.round(stalls.reduce((s, x) => s + x.waitTime, 0) / stalls.length);
  const highCount = zones.filter((z) => z.level === "high").length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-base font-semibold sm:text-lg">
                Live Operations Dashboard
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Auto-refresh every 3s · Last update tick #{tick}
              </p>
            </div>
            <div className="hidden sm:block">
              <QrEntryButton />
            </div>
          </header>

          <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Hero */}
            <section id="overview" className="animate-fade-in">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">Smart Stadium Experience</p>
                  <h2 className="mt-1 text-3xl font-bold sm:text-4xl">
                    Real-time intelligence for <span className="text-gradient">every fan</span>
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Reduce congestion, cut wait times, and guide attendees with live crowd data and AI-driven routing.
                  </p>
                </div>
                <div className="sm:hidden">
                  <QrEntryButton />
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Live Attendance"
                value={totalAttendance.toLocaleString()}
                hint={`${Math.round((totalAttendance / totalCapacity) * 100)}% of capacity`}
                icon={Users}
                accent="primary"
              />
              <StatCard
                label="Best Gate"
                value={recommendedGate?.name ?? "—"}
                hint={`${recommendedGate?.density ?? 0}% density`}
                icon={DoorOpen}
                accent="low"
              />
              <StatCard
                label="Avg Food Wait"
                value={`${avgWait}m`}
                hint="across all stalls"
                icon={Timer}
                accent="medium"
              />
              <StatCard
                label="Critical Zones"
                value={highCount}
                hint={highCount === 0 ? "All clear" : "Action recommended"}
                icon={Activity}
                accent={highCount > 0 ? "high" : "low"}
              />
            </section>

            {/* Recommendation */}
            <section id="gates">
              <GateRecommendation zone={recommendedGate} />
            </section>

            {/* Stadium Map */}
            <section id="map">
              <StadiumMap3D zones={zones} />
            </section>

            {/* Zones */}
            <section id="zones" className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Crowd Intelligence</h3>
                <span className="text-xs text-muted-foreground">Updated every 3s</span>
              </div>
              <LiveZones zones={zones} recommendedId={recommendedGate?.id} />
            </section>

            {/* Heatmap + Alerts */}
            <section className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <CrowdHeatmap zones={zones} />
              </div>
              <div id="alerts">
                <AlertsPanel alerts={alerts} />
              </div>
            </section>

            {/* Food + Navigation */}
            <section className="grid gap-4 lg:grid-cols-2">
              <div id="food">
                <FoodAnalytics stalls={stalls} />
              </div>
              <div id="navigation">
                <NavigationAssistant zones={zones} recommendedGate={recommendedGate} />
              </div>
            </section>

            <footer className="pt-6 pb-2 text-center text-xs text-muted-foreground">
              StadiumIQ · Smart Stadium Experience Platform · Demo build
            </footer>
          </main>
        </div>
        <ChatbotWidget />
      </div>
    </SidebarProvider>
  );
};

export default Index;
