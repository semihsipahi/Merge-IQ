import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Example diff data
const exampleDiff = [
  { type: "context", content: "function sum(a, b) {" },
  { type: "add", content: "  return a + b + 1;" },
  { type: "remove", content: "  return a + b;" },
  { type: "context", content: "}" },
];

export default function DiffView({ diff = exampleDiff }: { diff?: { type: "add" | "remove" | "context"; content: string }[] }) {
  const [stagedLines, setStagedLines] = useState<number[]>([]);

  const handleStage = (idx: number) => {
    setStagedLines((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#181A20] rounded-lg shadow-lg border border-[#23242a] p-0 overflow-hidden">
      <div className="text-lg font-bold px-6 py-4 border-b border-[#23242a] bg-[#101114]">Diff View</div>
      <div className="divide-y divide-[#23242a]">
        {diff.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-center px-6 py-2 text-sm font-mono transition-all duration-100 \
              ${line.type === "add" ? "bg-[#163c2a] text-green-300" : line.type === "remove" ? "bg-[#3c1a1a] text-red-300" : "bg-transparent text-[#E5E7EB]"} \
              ${stagedLines.includes(idx) ? "ring-2 ring-[#4fc3f7] bg-[#1a2a3a]" : ""}`}
            style={{ minHeight: 36 }}
          >
            <span className="flex-1 whitespace-pre">{line.content}</span>
            {line.type !== "context" && (
              <Button
                size="sm"
                variant={stagedLines.includes(idx) ? "default" : "outline"}
                className={`ml-4 ${stagedLines.includes(idx) ? "bg-[#4fc3f7] text-[#101114]" : ""}`}
                onClick={() => handleStage(idx)}
              >
                {stagedLines.includes(idx) ? "Staged" : "Stage"}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}