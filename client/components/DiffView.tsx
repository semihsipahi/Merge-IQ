import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type DiffLine = { type: "add" | "remove" | "context"; content: string };

const exampleDiff: DiffLine[] = [
  { type: "context", content: "// utils/math.ts" },
  { type: "context", content: "export function sum(a, b) {" },
  { type: "add", content: "  if (typeof a !== 'number' || typeof b !== 'number') return 0;" },
  { type: "context", content: "  return a + b;" },
  { type: "remove", content: "  // TODO: handle NaN" },
  { type: "context", content: "}" },
  { type: "context", content: "" },
  { type: "context", content: "export function multiply(a, b) {" },
  { type: "add", content: "  if (!a || !b) return 0;" },
  { type: "context", content: "  return a * b;" },
  { type: "context", content: "}" },
  { type: "context", content: "" },
  { type: "context", content: "// components/Button.tsx" },
  { type: "context", content: "export const Button = ({ children, ...props }) => {" },
  { type: "remove", content: "  return <button {...props}>{children}</button>;" },
  { type: "add", content: "  return <button className=\"btn\" {...props}>{children}</button>;" },
  { type: "context", content: "};" },
  { type: "context", content: "" },
  { type: "context", content: "// README.md" },
  { type: "add", content: "- Added multiply util" },
  { type: "add", content: "- Improved Button component" },
  { type: "remove", content: "- Initial version" },
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
      className={`relative w-full ${fullscreen ? "max-w-5xl h-[90vh] bg-[#181A20] rounded-xl shadow-2xl border border-[#23242a] p-0 overflow-hidden" : "max-w-xl bg-[#191b20] rounded-lg shadow-lg border border-[#23242a] p-0 overflow-hidden"} mx-auto`}
      style={fullscreen ? { zIndex: 50 } : {}}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#23242a] bg-[#101114]">
        <div className="text-base font-semibold">Diff View</div>
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
      <div className="divide-y divide-[#23242a] max-h-[55vh] overflow-auto scrollbar-thin scrollbar-thumb-[#23242a] scrollbar-track-[#181A20]">
        {diff.map((line, idx) => (
          <div
            key={idx}
            className={`group flex items-center gap-2 px-2 py-1 text-xs font-mono transition-all duration-100 \
              ${line.type === "add" ? "bg-[#182c22] text-green-300" : line.type === "remove" ? "bg-[#2c1818] text-red-300" : "bg-transparent text-[#E5E7EB]"} \
              ${stagedLines.includes(idx) ? "ring-1 ring-[#4fc3f7] bg-[#1a2a3a]" : ""} \
              hover:bg-[#23242a]`}
            style={{ minHeight: 24 }}
          >
            <input
              type="checkbox"
              checked={stagedLines.includes(idx)}
              onChange={() => toggleStage(idx)}
              className="accent-[#4fc3f7] w-3 h-3 rounded border border-[#23242a] bg-[#101114] focus:ring-0 focus:outline-none"
            />
            <span className="w-7 text-[10px] text-[#7a7e87] select-none text-right pr-1 opacity-60">{idx + 1}</span>
            <span className={`inline-block w-6 text-center rounded text-[10px] font-bold mr-1 \
              ${line.type === "add" ? "bg-[#1e3a24] text-green-400" : line.type === "remove" ? "bg-[#3a1e1e] text-red-400" : "bg-[#23242a] text-[#b0b4c1]"}`}>{line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}</span>
            <span className="flex-1 whitespace-pre">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}