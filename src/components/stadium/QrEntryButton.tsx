import { useState } from "react";
import { QrCode, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QrEntryButton() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const trigger = () => {
    setState("scanning");
    setTimeout(() => setState("done"), 1600);
    setTimeout(() => setState("idle"), 4200);
  };
  return (
    <Button
      onClick={trigger}
      variant="secondary"
      className="gap-2 border border-border/60"
      disabled={state === "scanning"}
    >
      {state === "idle" && <><QrCode className="h-4 w-4" /> Scan QR Entry</>}
      {state === "scanning" && <><Loader2 className="h-4 w-4 animate-spin" /> Scanning ticket...</>}
      {state === "done" && <><CheckCircle2 className="h-4 w-4 text-status-low" /> Entry verified</>}
    </Button>
  );
}
