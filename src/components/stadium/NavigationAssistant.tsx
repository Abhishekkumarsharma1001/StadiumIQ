import { useState } from "react";
import { Navigation, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zone } from "@/hooks/useStadiumData";

interface Props {
  zones: Zone[];
  recommendedGate?: Zone;
}

function buildRoute(seat: string, gate?: Zone): string[] {
  const trimmed = seat.trim().toUpperCase();
  if (!trimmed) return [];
  const block = trimmed.match(/^[A-Z]/)?.[0] ?? "C";
  const row = trimmed.match(/\d+/)?.[0] ?? "12";
  const g = gate?.name ?? "Gate B";
  return [
    `Use ${g} (lowest congestion)`,
    `Walk ~50m straight along Concourse`,
    `Turn left toward Block ${block}`,
    `Take stairwell ${block}-${(parseInt(row) % 4) + 1}`,
    `Your seat: Row ${row}, Block ${block}`,
  ];
}

export function NavigationAssistant({ recommendedGate }: Props) {
  const [seat, setSeat] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSteps(buildRoute(seat, recommendedGate));
  };

  return (
    <div className="card-premium p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
          <Navigation className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-semibold">Smart Navigation</h3>
          <p className="text-xs text-muted-foreground">Get the shortest path to your seat</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={seat}
          onChange={(e) => setSeat(e.target.value)}
          placeholder="e.g. C-23 or N-104"
          className="bg-muted/40"
        />
        <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      {steps.length > 0 && (
        <ol className="mt-4 space-y-2 animate-fade-in">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      )}
      {steps.length === 0 && (
        <p className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4 text-center text-xs text-muted-foreground">
          Enter your seat to generate a personalized route
        </p>
      )}
    </div>
  );
}
