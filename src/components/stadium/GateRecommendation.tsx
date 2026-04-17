import { Sparkles, ArrowRight } from "lucide-react";
import { Zone } from "@/hooks/useStadiumData";
import { Button } from "@/components/ui/button";

interface Props {
  zone?: Zone;
}

export function GateRecommendation({ zone }: Props) {
  if (!zone) return null;
  return (
    <div className="card-premium relative overflow-hidden p-6">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI Recommendation
        </div>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
          Best gate to enter:{" "}
          <span className="text-gradient">{zone.name}</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lowest crowd density right now ({zone.density}%) — estimated entry under 90 seconds.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Navigate to {zone.name}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="secondary">Show on map</Button>
        </div>
      </div>
    </div>
  );
}
