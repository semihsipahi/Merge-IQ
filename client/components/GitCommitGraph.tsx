import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText, GitBranch, GitMerge, Maximize2, X } from "lucide-react";
import { useState } from "react";
import DiffView from "./DiffView";

interface CommitNode {
  id: string;
  hash: string;
  message: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  timeAgo: string;
  branch: string;
  type: "commit" | "merge" | "branch";
  filesChanged: number;
  additions: number;
  deletions: number;
  branchColor: string;
  files?: { path: string; additions: number; deletions: number }[];
}

const dummyFiles = [
  { path: "src/utils/math.ts", additions: 2, deletions: 1 },
  { path: "src/components/Button.tsx", additions: 5, deletions: 0 },
];

const commitData: CommitNode[] = [
  {
    id: "1",
    hash: "a1b2c3d",
    message:
      "Add user authentication system with JWT tokens and refresh mechanism",
    author: { name: "John Doe", email: "john@example.com", avatar: "" },
    date: "2024-01-15 14:30",
    timeAgo: "2 hours ago",
    branch: "main",
    type: "commit",
    filesChanged: 8,
    additions: 145,
    deletions: 23,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "2",
    hash: "e4f5g6h",
    message: "Merge pull request #123 from feature/user-auth",
    author: { name: "Jane Smith", email: "jane@example.com", avatar: "" },
    date: "2024-01-15 12:15",
    timeAgo: "4 hours ago",
    branch: "main",
    type: "merge",
    filesChanged: 12,
    additions: 200,
    deletions: 45,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "3",
    hash: "i7j8k9l",
    message: "Fix login validation and improve error handling for edge cases",
    author: { name: "John Doe", email: "john@example.com", avatar: "" },
    date: "2024-01-15 10:45",
    timeAgo: "6 hours ago",
    branch: "feature/user-auth",
    type: "commit",
    filesChanged: 3,
    additions: 67,
    deletions: 12,
    branchColor: "hsl(var(--git-green))",
    files: dummyFiles,
  },
  {
    id: "4",
    hash: "m1n2o3p",
    message:
      "Update dependencies to latest versions and fix security vulnerabilities",
    author: { name: "Alice Johnson", email: "alice@example.com", avatar: "" },
    date: "2024-01-15 09:20",
    timeAgo: "8 hours ago",
    branch: "main",
    type: "commit",
    filesChanged: 2,
    additions: 15,
    deletions: 8,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "5",
    hash: "q4r5s6t",
    message:
      "Initial project structure and configuration with TypeScript support",
    author: { name: "John Doe", email: "john@example.com", avatar: "" },
    date: "2024-01-14 16:00",
    timeAgo: "1 day ago",
    branch: "main",
    type: "commit",
    filesChanged: 15,
    additions: 450,
    deletions: 0,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "6",
    hash: "x9y8z7w",
    message: "Add TypeScript configuration and build setup with webpack",
    author: { name: "Bob Wilson", email: "bob@example.com", avatar: "" },
    date: "2024-01-14 14:30",
    timeAgo: "1 day ago",
    branch: "develop",
    type: "commit",
    filesChanged: 6,
    additions: 89,
    deletions: 5,
    branchColor: "hsl(var(--git-purple))",
    files: dummyFiles,
  },
  {
    id: "7",
    hash: "z1x2y3w",
    message: "Add feature flag system for A/B testing and gradual rollouts",
    author: { name: "Sarah Lee", email: "sarah@example.com", avatar: "" },
    date: "2024-01-14 13:00",
    timeAgo: "1 day ago",
    branch: "feature/flags",
    type: "commit",
    filesChanged: 4,
    additions: 92,
    deletions: 12,
    branchColor: "hsl(var(--git-orange))",
    files: dummyFiles,
  },
  {
    id: "8",
    hash: "a8b9c1d",
    message: "Implement user dashboard with responsive design and dark theme",
    author: { name: "Mike Chen", email: "mike@example.com", avatar: "" },
    date: "2024-01-14 11:15",
    timeAgo: "1 day ago",
    branch: "feature/dashboard",
    type: "commit",
    filesChanged: 7,
    additions: 156,
    deletions: 23,
    branchColor: "hsl(var(--git-cyan))",
    files: dummyFiles,
  },
  {
    id: "9",
    hash: "d2e3f4g",
    message: "Add API endpoints for user management and authentication flows",
    author: { name: "Lisa Wang", email: "lisa@example.com", avatar: "" },
    date: "2024-01-14 09:30",
    timeAgo: "1 day ago",
    branch: "feature/api",
    type: "commit",
    filesChanged: 9,
    additions: 234,
    deletions: 45,
    branchColor: "hsl(var(--git-yellow))",
    files: dummyFiles,
  },
  {
    id: "10",
    hash: "g5h6i7j",
    message: "Merge branch 'hotfix/critical-bug' into main",
    author: { name: "Alex Thompson", email: "alex@example.com", avatar: "" },
    date: "2024-01-13 18:45",
    timeAgo: "2 days ago",
    branch: "main",
    type: "merge",
    filesChanged: 3,
    additions: 12,
    deletions: 8,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "11",
    hash: "j8k9l1m",
    message: "Fix critical memory leak in data processing pipeline",
    author: { name: "David Kim", email: "david@example.com", avatar: "" },
    date: "2024-01-13 17:20",
    timeAgo: "2 days ago",
    branch: "hotfix/critical-bug",
    type: "commit",
    filesChanged: 2,
    additions: 8,
    deletions: 15,
    branchColor: "hsl(var(--git-red))",
    files: dummyFiles,
  },
  {
    id: "12",
    hash: "m2n3o4p",
    message: "Update database schema for better performance and indexing",
    author: { name: "Emma Davis", email: "emma@example.com", avatar: "" },
    date: "2024-01-13 15:10",
    timeAgo: "2 days ago",
    branch: "main",
    type: "commit",
    filesChanged: 5,
    additions: 67,
    deletions: 34,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "13",
    hash: "p5q6r7s",
    message: "Add comprehensive error logging and monitoring system",
    author: { name: "Ryan Martinez", email: "ryan@example.com", avatar: "" },
    date: "2024-01-13 12:30",
    timeAgo: "2 days ago",
    branch: "feature/monitoring",
    type: "commit",
    filesChanged: 8,
    additions: 178,
    deletions: 23,
    branchColor: "hsl(var(--git-pink))",
    files: dummyFiles,
  },
  {
    id: "14",
    hash: "s8t9u1v",
    message: "Implement real-time notifications with WebSocket support",
    author: { name: "Sophie Brown", email: "sophie@example.com", avatar: "" },
    date: "2024-01-13 10:15",
    timeAgo: "2 days ago",
    branch: "feature/notifications",
    type: "commit",
    filesChanged: 6,
    additions: 145,
    deletions: 12,
    branchColor: "hsl(var(--git-purple))",
    files: dummyFiles,
  },
  {
    id: "15",
    hash: "v2w3x4y",
    message: "Add unit tests for authentication module with 95% coverage",
    author: { name: "Tom Wilson", email: "tom@example.com", avatar: "" },
    date: "2024-01-12 16:45",
    timeAgo: "3 days ago",
    branch: "feature/testing",
    type: "commit",
    filesChanged: 12,
    additions: 289,
    deletions: 45,
    branchColor: "hsl(var(--git-green))",
    files: dummyFiles,
  },
  {
    id: "16",
    hash: "y5z6a7b",
    message:
      "Optimize database queries and add caching layer for better performance",
    author: { name: "Grace Liu", email: "grace@example.com", avatar: "" },
    date: "2024-01-12 14:20",
    timeAgo: "3 days ago",
    branch: "feature/optimization",
    type: "commit",
    filesChanged: 7,
    additions: 134,
    deletions: 67,
    branchColor: "hsl(var(--git-orange))",
    files: dummyFiles,
  },
  {
    id: "17",
    hash: "b8c9d1e",
    message: "Add internationalization support for multiple languages",
    author: {
      name: "Carlos Rodriguez",
      email: "carlos@example.com",
      avatar: "",
    },
    date: "2024-01-12 11:30",
    timeAgo: "3 days ago",
    branch: "feature/i18n",
    type: "commit",
    filesChanged: 15,
    additions: 267,
    deletions: 23,
    branchColor: "hsl(var(--git-cyan))",
    files: dummyFiles,
  },
  {
    id: "18",
    hash: "e2f3g4h",
    message: "Implement secure file upload system with virus scanning",
    author: { name: "Nina Petrov", email: "nina@example.com", avatar: "" },
    date: "2024-01-12 09:15",
    timeAgo: "3 days ago",
    branch: "feature/file-upload",
    type: "commit",
    filesChanged: 9,
    additions: 198,
    deletions: 34,
    branchColor: "hsl(var(--git-yellow))",
    files: dummyFiles,
  },
  {
    id: "19",
    hash: "h5i6j7k",
    message: "Add comprehensive documentation and API reference",
    author: { name: "Ben Taylor", email: "ben@example.com", avatar: "" },
    date: "2024-01-11 17:45",
    timeAgo: "4 days ago",
    branch: "feature/docs",
    type: "commit",
    filesChanged: 23,
    additions: 456,
    deletions: 89,
    branchColor: "hsl(var(--git-purple))",
    files: dummyFiles,
  },
  {
    id: "20",
    hash: "k8l9m1n",
    message: "Initial commit - Project setup and basic structure",
    author: { name: "Project Owner", email: "owner@example.com", avatar: "" },
    date: "2024-01-11 10:00",
    timeAgo: "4 days ago",
    branch: "main",
    type: "commit",
    filesChanged: 8,
    additions: 234,
    deletions: 0,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  // Additional commits for scrolling
  {
    id: "21",
    hash: "n3o4p5q",
    message: "Add Redis caching integration for session management",
    author: { name: "Alex Chen", email: "alex.chen@example.com", avatar: "" },
    date: "2024-01-10 16:20",
    timeAgo: "5 days ago",
    branch: "feature/redis",
    type: "commit",
    filesChanged: 6,
    additions: 123,
    deletions: 45,
    branchColor: "hsl(var(--git-orange))",
    files: dummyFiles,
  },
  {
    id: "22",
    hash: "q6r7s8t",
    message: "Implement OAuth2 integration with Google and GitHub",
    author: { name: "Maria Santos", email: "maria@example.com", avatar: "" },
    date: "2024-01-10 14:15",
    timeAgo: "5 days ago",
    branch: "feature/oauth",
    type: "commit",
    filesChanged: 11,
    additions: 267,
    deletions: 23,
    branchColor: "hsl(var(--git-cyan))",
    files: dummyFiles,
  },
  {
    id: "23",
    hash: "t9u1v2w",
    message: "Add email notification system with template engine",
    author: { name: "Robert Kim", email: "robert@example.com", avatar: "" },
    date: "2024-01-10 11:30",
    timeAgo: "5 days ago",
    branch: "feature/email",
    type: "commit",
    filesChanged: 8,
    additions: 189,
    deletions: 12,
    branchColor: "hsl(var(--git-yellow))",
    files: dummyFiles,
  },
  {
    id: "24",
    hash: "w3x4y5z",
    message: "Merge pull request #98 from feature/performance-improvements",
    author: { name: "Tech Lead", email: "lead@example.com", avatar: "" },
    date: "2024-01-09 18:45",
    timeAgo: "6 days ago",
    branch: "main",
    type: "merge",
    filesChanged: 15,
    additions: 234,
    deletions: 78,
    branchColor: "hsl(var(--git-blue))",
    files: dummyFiles,
  },
  {
    id: "25",
    hash: "z6a7b8c",
    message: "Optimize React component rendering with useMemo and useCallback",
    author: {
      name: "Frontend Team",
      email: "frontend@example.com",
      avatar: "",
    },
    date: "2024-01-09 15:20",
    timeAgo: "6 days ago",
    branch: "feature/performance-improvements",
    type: "commit",
    filesChanged: 12,
    additions: 156,
    deletions: 89,
    branchColor: "hsl(var(--git-green))",
    files: dummyFiles,
  },
  {
    id: "26",
    hash: "c9d1e2f",
    message: "Add comprehensive logging system with structured logs",
    author: { name: "DevOps Team", email: "devops@example.com", avatar: "" },
    date: "2024-01-09 12:10",
    timeAgo: "6 days ago",
    branch: "feature/logging",
    type: "commit",
    filesChanged: 7,
    additions: 145,
    deletions: 23,
    branchColor: "hsl(var(--git-pink))",
    files: dummyFiles,
  },
  {
    id: "27",
    hash: "f3g4h5i",
    message: "Implement automatic database backup system",
    author: { name: "Backend Team", email: "backend@example.com", avatar: "" },
    date: "2024-01-08 16:30",
    timeAgo: "1 week ago",
    branch: "feature/backup",
    type: "commit",
    filesChanged: 5,
    additions: 98,
    deletions: 34,
    branchColor: "hsl(var(--git-purple))",
    files: dummyFiles,
  },
  {
    id: "28",
    hash: "i6j7k8l",
    message: "Add API rate limiting and throttling mechanisms",
    author: {
      name: "Security Team",
      email: "security@example.com",
      avatar: "",
    },
    date: "2024-01-08 13:45",
    timeAgo: "1 week ago",
    branch: "feature/security",
    type: "commit",
    filesChanged: 9,
    additions: 178,
    deletions: 45,
    branchColor: "hsl(var(--git-red))",
    files: dummyFiles,
  },
  {
    id: "29",
    hash: "l9m1n2o",
    message: "Implement dark mode toggle with system preference detection",
    author: { name: "UI Team", email: "ui@example.com", avatar: "" },
    date: "2024-01-08 10:20",
    timeAgo: "1 week ago",
    branch: "feature/dark-mode",
    type: "commit",
    filesChanged: 14,
    additions: 234,
    deletions: 67,
    branchColor: "hsl(var(--git-cyan))",
    files: dummyFiles,
  },
  {
    id: "30",
    hash: "o2p3q4r",
    message: "Add comprehensive integration tests for API endpoints",
    author: { name: "QA Team", email: "qa@example.com", avatar: "" },
    date: "2024-01-07 14:15",
    timeAgo: "1 week ago",
    branch: "feature/integration-tests",
    type: "commit",
    filesChanged: 18,
    additions: 345,
    deletions: 23,
    branchColor: "hsl(var(--git-green))",
    files: dummyFiles,
  },
];

// Yeni: Basit bir tree layout için branch sütunlarını belirle
const branchOrder: Record<string, number> = {};
let branchIndex = 0;
commitData.forEach((commit) => {
  if (!(commit.branch in branchOrder)) {
    branchOrder[commit.branch] = branchIndex++;
  }
});
const branchColors: Record<string, string> = {};
commitData.forEach((commit) => {
  branchColors[commit.branch] = commit.branchColor;
});

// Parent-child ilişkisi için örnek (gerçek git graph için parent hash gerekir)
const parentMap: Record<string, string[]> = {
  a1b2c3d: ["e4f5g6h"],
  e4f5g6h: ["i7j8k9l", "m1n2o3p"],
  i7j8k9l: ["m1n2o3p"],
  m1n2o3p: ["q4r5s6t"],
  // ... örnek devamı ...
};

export default function GitCommitGraph() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<any>(null);
  const [previewFileIdx, setPreviewFileIdx] = useState<number | null>(null);
  const [fullscreenDiffIdx, setFullscreenDiffIdx] = useState<number | null>(
    null,
  );
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelFullscreen, setRightPanelFullscreen] = useState(false); // NEW

  // Dummy diff data
  const dummyDiff = [
    { type: "context", content: "function sum(a, b) {" },
    { type: "add", content: "  return a + b + 1;" },
    { type: "remove", content: "  return a + b;" },
    { type: "context", content: "}" },
  ];

  return (
    <div className="flex flex-row h-full w-full bg-[#101114] text-[#E5E7EB] font-inter">
      {/* Commit History Alanı */}
      {leftPanelOpen && (
        <div
          className={`flex-1 flex flex-col relative overflow-x-auto transition-all duration-200 ${rightPanelOpen ? "" : "!w-full"}`}
          style={{ minWidth: 700, background: "#181A20" }}
        >
          {/* Header */}
          <div className="px-10 py-6 border-b border-[#181A20] bg-[#101114] flex-shrink-0 flex items-center justify-between relative">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Commit History
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-1">
                Project commit graph
              </p>
            </div>
            {/* Çarpı iconu kaldırıldı */}
          </div>
          {/* Commit Graph */}
          <div
            className="relative flex-1 overflow-y-auto"
            style={{
              minHeight: commitData.length * 64 + 40,
              background: "#181A20",
            }}
          >
            <div
              className="flex flex-col relative"
              style={{ minHeight: commitData.length * 64 + 40 }}
            >
              {commitData.map((commit, i) => {
                const isSelected =
                  selectedCommit && selectedCommit.hash === commit.hash;
                const isHovered = hovered === commit.hash;
                return (
                  <div
                    key={commit.hash}
                    className={`flex flex-col transition-all duration-150 cursor-pointer w-full \
                      border \
                      ${isSelected ? "border-[#4fc3f7] bg-[#17293a] shadow-lg scale-[0.99]" : isHovered ? "border-[#23242a] bg-[#181d22] scale-[0.995]" : "border-transparent hover:border-[#23242a] hover:bg-[#181d22]"}`}
                    style={{
                      borderRadius: 10,
                      margin: "4px 0",
                      boxSizing: "border-box",
                      minHeight: 48,
                      padding: "14px 20px",
                    }}
                    onClick={() => {
                      setSelectedCommit(commit);
                      setRightPanelOpen(true);
                      setLeftPanelOpen(true);
                    }}
                    onMouseEnter={() => setHovered(commit.hash)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex items-center gap-2 min-w-0 w-full">
                      <span className="truncate font-semibold text-[13px] text-[#E5E7EB] flex-1">
                        {commit.message}
                      </span>
                      {commit.type === "merge" && (
                        <GitMerge className="w-3 h-3 text-[#fbc02d] ml-1" />
                      )}
                      {commit.type === "branch" && (
                        <GitBranch className="w-3 h-3 text-[#4fc3f7] ml-1" />
                      )}
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-[#23242a] text-[10px] font-mono text-[#4fc3f7] border border-[#23242a]">
                        {commit.branch}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#A1A1AA] mt-0.5 w-full">
                      <Avatar className="w-3.5 h-3.5 mr-1">
                        <AvatarImage src={commit.author.avatar} />
                        <AvatarFallback>{commit.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>{commit.author.name}</span>
                      <span className="mx-1">•</span>
                      <span>{commit.timeAgo}</span>
                      <span className="mx-1">•</span>
                      <span className="font-mono text-[#b0b4c1]">
                        {commit.hash}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Sağda sabit detay paneli */}
      {rightPanelOpen && (
        <div
          className={`w-[380px] border-l border-[#181A20] bg-[#101114] flex flex-col p-10 overflow-y-auto relative transition-all duration-200 ${!leftPanelOpen ? "!w-full" : ""}`}
          style={{ minWidth: 260 }}
        >
          <button
            className="absolute top-3 right-3 p-2 rounded hover:bg-[#23242a] transition"
            onClick={() => setRightPanelOpen(false)}
            title="Kapat"
            style={{ display: rightPanelFullscreen ? "none" : undefined }}
          >
            <X className="w-5 h-5 text-[#A1A1AA]" />
          </button>
          <button
            className="absolute top-3 right-12 p-2 rounded hover:bg-[#23242a] transition"
            onClick={() => setRightPanelFullscreen((f) => !f)}
            title={
              rightPanelFullscreen ? "Önceki pozisyona dön" : "Ekranı kapla"
            }
          >
            <Maximize2
              className="w-5 h-5 text-[#4fc3f7]"
              style={{
                transform: rightPanelFullscreen ? "rotate(45deg)" : "none",
              }}
            />
          </button>
          {selectedCommit && selectedCommit.author ? (
            <>
              <div className="flex items-center gap-4 mb-8">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={selectedCommit.author.avatar || undefined}
                  />
                  <AvatarFallback>
                    {selectedCommit.author.name
                      ? selectedCommit.author.name[0]
                      : "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-bold text-xl text-[#E5E7EB]">
                    {selectedCommit.author.name || "Unknown"}
                  </div>
                  <div className="text-sm text-[#A1A1AA]">
                    {selectedCommit.date || "-"}
                  </div>
                </div>
              </div>
              <div className="text-2xl font-semibold mb-3 text-[#E5E7EB]">
                {selectedCommit.message || "No message"}
              </div>
              <div className="text-sm text-[#A1A1AA] mb-5 font-mono">
                {selectedCommit.hash || "-"}
              </div>
              <div className="mb-5">
                <span className="inline-block px-3 py-1 rounded bg-[#23242a] text-[13px] font-mono text-[#4fc3f7] border border-[#23242a]">
                  {selectedCommit.branch || "-"}
                </span>
              </div>
              <Separator className="my-6 bg-[#23242a]" />
              <div className="mb-3 text-sm text-[#A1A1AA] font-semibold">
                Changed Files
              </div>
              <div className="flex flex-col gap-3">
                {(selectedCommit.files || []).map((file: any, idx: number) => (
                  <div key={idx}>
                    <div
                      className={`flex items-center gap-2 text-[12px] text-[#b0b4c1] bg-[#181A20] rounded px-2 py-1 cursor-pointer transition-all \
                        ${previewFileIdx === idx ? "ring-2 ring-[#4fc3f7] bg-[#1a2a3a]" : "hover:bg-[#23242a]"}`}
                      onClick={() =>
                        setPreviewFileIdx(previewFileIdx === idx ? null : idx)
                      }
                    >
                      <FileText className="w-4 h-4 mr-2 text-[#4fc3f7]" />
                      <span className="truncate max-w-[160px]">
                        {file.path || "-"}
                      </span>
                      <span className="ml-auto flex items-center gap-2">
                        <span className="text-green-400 font-mono text-xs">
                          +{file.additions || 0}
                        </span>
                        <span className="text-red-400 font-mono ml-2 text-xs">
                          -{file.deletions || 0}
                        </span>
                        <button
                          className="ml-2 p-1 rounded hover:bg-[#23242a] transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFullscreenDiffIdx(idx);
                          }}
                          title="Show full diff"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-[#4fc3f7]" />
                        </button>
                      </span>
                    </div>
                    {previewFileIdx === idx && (
                      <div className="mt-2 mb-2">
                        <DiffView />
                      </div>
                    )}
                    {fullscreenDiffIdx === idx && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <DiffView
                          fullscreen
                          onClose={() => setFullscreenDiffIdx(null)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-[#A1A1AA] text-[15px] mt-16 text-center">
              Select a commit to see details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
