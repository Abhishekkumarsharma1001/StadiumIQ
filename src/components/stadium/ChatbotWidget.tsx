import { useState } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Msg { from: "bot" | "user"; text: string; }

const REPLIES = [
  "Gate B currently has the lowest queue — under 90s wait.",
  "Try Champion Coffee, only a 2-minute wait right now.",
  "Restrooms near Block North are least crowded.",
  "Kickoff is in 18 minutes — head to your seat soon.",
  "I've routed you the shortest path. Follow concourse signs.",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Hi! I'm StadiumIQ Assistant. Ask me about gates, food, or your seat." },
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
    setMsgs((m) => [...m, { from: "user", text }, { from: "bot", text: reply }]);
    setText("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90"
        size="icon"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm card-premium overflow-hidden transition-all duration-300 origin-bottom-right",
          open ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border/60 p-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">StadiumIQ Assistant</p>
            <p className="text-[10px] text-muted-foreground">Always online</p>
          </div>
        </div>
        <div className="h-72 space-y-2 overflow-y-auto scrollbar-thin p-3">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm animate-fade-in",
                  m.from === "user"
                    ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-border/60 p-3">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask anything..."
            className="bg-muted/40"
          />
          <Button type="submit" size="icon" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
