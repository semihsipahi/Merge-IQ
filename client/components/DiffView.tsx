import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type DiffLine = { type: "add" | "remove" | "context"; content: string };

const exampleDiff: DiffLine[] = [
  { type: "context", content: "function sum(a, b) {" },
  { type: "add", content: "  return a + b + 1;" },
  { type: "remove", content: "  return a + b;" },
  { type: "context", content: "}" },
  // ...daha fazla satır eklenebilir
];

export default function DiffView({
  diff = exampleDiff,
  fullscreen = false,
  onClose,
}: {
  diff?: DiffLine[];
  fullscreen?: boolean;
  onClose?: () => void;
}) {
  const [stagedLines, setStagedLines] = useState<number[]>([]);

  const allStaged = stagedLines.length === diff.length;
  const toggleStage = (idx: number) => {
    setStagedLines((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const stageAll = () => setStagedLines(diff.map((_, i) => i));
  const unstageAll = () => setStagedLines([]);

  return (
    <div
      className={`relative w-full ${fullscreen ? "max-w-5xl h-[90vh] bg-[#181A20] rounded-xl shadow-2xl border border-[#23242a] p-0 overflow-hidden" : "max-w-2xl bg-[#181A20] rounded-lg shadow-lg border border-[#23242a] p-0 overflow-hidden"} mx-auto`}
      style={fullscreen ? { zIndex: 50 } : {}}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#23242a] bg-[#101114]">
        <div className="text-lg font-bold">Diff View</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={allStaged ? unstageAll : stageAll}>
            {allStaged ? "Unstage All" : "Stage All"}
          </Button>
          {fullscreen && onClose && (
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      <div className="divide-y divide-[#23242a] max-h-[70vh] overflow-auto">
        {diff.map((line, idx) => (
          <div
            key={idx}
            className={`group flex items-center gap-3 px-4 py-1.5 text-sm font-mono transition-all duration-100 \
              ${line.type === "add" ? "bg-[#163c2a] text-green-300" : line.type === "remove" ? "bg-[#3c1a1a] text-red-300" : "bg-transparent text-[#E5E7EB]"} \
              ${stagedLines.includes(idx) ? "ring-2 ring-[#4fc3f7] bg-[#1a2a3a]" : ""} \
              hover:bg-[#23242a]`}
            style={{ minHeight: 32 }}
          >
            <input
              type="checkbox"
              checked={stagedLines.includes(idx)}
              onChange={() => toggleStage(idx)}
              className="accent-[#4fc3f7] w-4 h-4 rounded border border-[#23242a] bg-[#101114] focus:ring-0 focus:outline-none"
            />
            <span className="w-10 text-xs text-[#7a7e87] select-none text-right pr-2 opacity-70">{idx + 1}</span>
            <span className="flex-1 whitespace-pre">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}