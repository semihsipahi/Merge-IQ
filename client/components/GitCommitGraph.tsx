import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Copy,
  ExternalLink,
  Clock,
  FileText,
} from "lucide-react";

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
}

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

  // Sağda sabit detay paneli için fonksiyon
  const openCommitDetail = (commit: CommitNode) => {
    setSelectedCommit({
      ...commit,
      description: "Detailed description of the commit changes and impact.",
      committer: commit.author,
      parents: [],
      children: [],
      files: [
        {
          path: "src/components/LoginForm.tsx",
          type: "modified" as const,
          additions: 8,
          deletions: 3,
          diff: "",
          staged: false,
        },
        {
          path: "src/types/auth.ts",
          type: "added" as const,
          additions: 15,
          deletions: 0,
          diff: "",
          staged: true,
        },
        {
          path: "src/utils/validation.ts",
          type: "modified" as const,
          additions: 12,
          deletions: 5,
          diff: "",
          staged: false,
        },
      ],
    });
  };

  return (
    <div className="flex flex-row h-full w-full bg-[#23272f] text-white font-inter">
      {/* Orta alan: Commit Treeview ve Commit List */}
      <div className="flex-1 flex flex-col relative overflow-x-auto" style={{ minWidth: 700 }}>
        {/* Header */}
        <div className="px-8 py-5 border-b border-[#353945] bg-[#23272f] flex-shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Commit History</h2>
            <p className="text-xs text-[#8f95b2] mt-1">Timeline of recent commits and changes</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs font-mono bg-[#2d313a] border-[#353945] text-[#4fc3f7]">main</Badge>
            <Badge variant="secondary" className="text-xs bg-[#353945] border-0 text-[#8f95b2]">{commitData.length} commits</Badge>
          </div>
        </div>
        {/* Commit Treeview + List */}
        <ScrollArea className="flex-1 h-full">
          <div className="relative" style={{ minHeight: commitData.length * 64 + 40 }}>
            {/* SVG Treeview */}
            <svg width={120 + Object.keys(branchOrder).length * 80} height={commitData.length * 64 + 40} className="absolute left-0 top-0 z-0">
              {/* Branch çizgileri ve merge pathleri */}
              {commitData.map((commit, i) => {
                const parents = parentMap[commit.hash] || [];
                return parents.map((parentHash) => {
                  const parentIdx = commitData.findIndex((c) => c.hash === parentHash);
                  if (parentIdx === -1) return null;
                  const fromX = 80 + branchOrder[commit.branch] * 80;
                  const fromY = i * 64 + 40;
                  const toX = 80 + branchOrder[commitData[parentIdx].branch] * 80;
                  const toY = parentIdx * 64 + 40;
                  const color = branchColors[commit.branch];
                  const path = `M${fromX},${fromY} C${fromX + 40},${fromY} ${toX - 40},${toY} ${toX},${toY}`;
                  return (
                    <path
                      key={commit.hash + parentHash}
                      d={path}
                      stroke={color}
                      strokeWidth={4}
                      fill="none"
                      opacity={0.7}
                    />
                  );
                });
              })}
              {/* Branch label'ları üstte */}
              {Object.entries(branchOrder).map(([branch, idx]) => (
                <g key={branch}>
                  <rect x={80 + idx * 80 - 30} y={0} width={60} height={24} rx={8} fill={branchColors[branch]} opacity={0.15} />
                  <text x={80 + idx * 80} y={18} textAnchor="middle" fontSize={13} fill={branchColors[branch]} fontWeight="bold">{branch}</text>
                </g>
              ))}
            </svg>
            {/* Commit List */}
            <div className="relative z-10">
              {commitData.map((commit, i) => {
                const x = 80 + branchOrder[commit.branch] * 80;
                const y = i * 64 + 40;
                const isSelected = selectedCommit && selectedCommit.hash === commit.hash;
                const isHovered = hovered === commit.hash;
                return (
                  <div
                    key={commit.hash}
                    className={`flex items-center group transition-all duration-150 \
                      ${isSelected ? "bg-[#2d313a] ring-2 ring-[#4fc3f7]" : isHovered ? "bg-[#232b3a] shadow-lg" : "hover:bg-[#232b3a]"}`}
                    style={{ position: "absolute", left: 0, top: y - 24, width: "100%", height: 56, paddingLeft: x + 24, zIndex: isSelected ? 2 : 1 }}
                    onClick={() => openCommitDetail(commit)}
                    onMouseEnter={() => setHovered(commit.hash)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Commit Dot */}
                    <div className="relative" style={{ left: -x + 8 }}>
                      <div
                        className={`w-5 h-5 rounded-full border-2 border-[#23272f] shadow-lg transition-all duration-150 ${isSelected ? "ring-2 ring-[#4fc3f7]" : isHovered ? "ring-2 ring-[#8f95b2]" : ""}`}
                        style={{ background: commit.branchColor, boxShadow: isSelected ? "0 0 0 4px #4fc3f755" : isHovered ? "0 0 0 4px #8f95b255" : "0 2px 8px #0003" }}
                      />
                    </div>
                    {/* Commit Message & Meta */}
                    <div className="flex flex-col ml-4 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium text-[15px] text-white max-w-[340px]">{commit.message}</span>
                        {commit.type === "merge" && <GitMerge className="w-4 h-4 text-[#fbc02d] ml-1" />}
                        {commit.type === "branch" && <GitBranch className="w-4 h-4 text-[#4fc3f7] ml-1" />}
                        <span className="ml-2 px-2 py-0.5 rounded bg-[#353945] text-xs font-mono text-[#4fc3f7]">{commit.branch}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#8f95b2] mt-1">
                        <Avatar className="w-5 h-5 mr-1">
                          <AvatarImage src={commit.author.avatar} />
                          <AvatarFallback>{commit.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{commit.author.name}</span>
                        <span className="mx-1">•</span>
                        <span>{commit.timeAgo}</span>
                        <span className="mx-1">•</span>
                        <span className="font-mono text-[#b0b4c1]">{commit.hash}</span>
                        <span className="mx-1">•</span>
                        <span><FileText className="inline w-3 h-3 mr-1" />{commit.filesChanged} files</span>
                        <span className="mx-1">•</span>
                        <span className="text-green-400">+{commit.additions}</span>
                        <span className="text-red-400">-{commit.deletions}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* Sağda sabit detay paneli */}
      <div className="w-[370px] border-l border-[#353945] bg-[#23272f] flex flex-col p-6 overflow-y-auto" style={{ minWidth: 320 }}>
        {selectedCommit ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedCommit.author.avatar} />
                <AvatarFallback>{selectedCommit.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg text-white">{selectedCommit.author.name}</div>
                <div className="text-xs text-[#8f95b2]">{selectedCommit.date}</div>
              </div>
            </div>
            <div className="mb-2 text-[15px] font-medium text-white">{selectedCommit.message}</div>
            <div className="mb-4 text-xs text-[#8f95b2] font-mono">{selectedCommit.hash}</div>
            <div className="mb-4 text-sm text-[#b0b4c1]">{selectedCommit.description}</div>
            <Separator className="my-4 bg-[#353945]" />
            <div className="mb-2 text-xs text-[#8f95b2]">Changed Files</div>
            <div className="flex flex-col gap-2">
              {selectedCommit.files.map((file: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#b0b4c1]">
                  <FileText className="w-4 h-4 mr-1 text-[#4fc3f7]" />
                  <span>{file.path}</span>
                  <span className="ml-auto">
                    <span className="text-green-400">+{file.additions}</span>
                    <span className="text-red-400 ml-2">-{file.deletions}</span>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-[#8f95b2] text-sm mt-10 text-center">Select a commit to see details</div>
        )}
      </div>
    </div>
  );
}
