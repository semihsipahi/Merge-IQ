import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CommitDetailModal from "./CommitDetailModal";
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const openCommitDetail = (commit: CommitNode) => {
    // Transform commit data to match the detail modal interface
    const detailCommit = {
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
    };
    setSelectedCommit(detailCommit);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex-1 bg-background flex flex-col min-h-0">
      {/* Dark Header */}
      <div className="px-6 py-5 border-b border-border bg-layout-panel/50 glass-subtle flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Commit History
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Timeline of recent commits and changes
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="text-xs font-mono bg-card/50 border-border"
            >
              main
            </Badge>
            <Badge
              variant="secondary"
              className="text-xs bg-secondary border-0"
            >
              {commitData.length} commits
            </Badge>
          </div>
        </div>
      </div>

      {/* Fixed height scrollable content */}
      <div className="flex-1 overflow-auto min-h-0">
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="p-6">
            <svg width="100%" height={commitData.length * 60 + 40} style={{ minWidth: 400 }}>
              {/* Kavisli bağlantı çizgileri */}
              {commitData.map((commit, i) => {
                const parents = parentMap[commit.hash] || [];
                return parents.map((parentHash) => {
                  const parentIdx = commitData.findIndex((c) => c.hash === parentHash);
                  if (parentIdx === -1) return null;
                  const fromX = 60 + branchOrder[commit.branch] * 60;
                  const fromY = i * 60 + 40;
                  const toX = 60 + branchOrder[commitData[parentIdx].branch] * 60;
                  const toY = parentIdx * 60 + 40;
                  const color = branchColors[commit.branch];
                  // Kavisli path
                  const path = `M${fromX},${fromY} C${fromX + 30},${fromY} ${toX - 30},${toY} ${toX},${toY}`;
                  return (
                    <path
                      key={commit.hash + parentHash}
                      d={path}
                      stroke={color}
                      strokeWidth={2}
                      fill="none"
                      opacity={0.5}
                    />
                  );
                });
              })}
              {/* Commit node'ları */}
              {commitData.map((commit, i) => {
                const x = 60 + branchOrder[commit.branch] * 60;
                const y = i * 60 + 40;
                return (
                  <g
                    key={commit.hash}
                    onMouseEnter={() => setHovered(commit.hash)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={10}
                      fill={commit.branchColor}
                      stroke="#222"
                      strokeWidth={2}
                      filter={hovered === commit.hash ? "drop-shadow(0 0 8px #fff5)" : undefined}
                    />
                    {/* Tooltip */}
                    {hovered === commit.hash && (
                      <foreignObject x={x + 15} y={y - 30} width={220} height={60}>
                        <div className="commit-tooltip">
                          <div>{commit.message}</div>
                          <div className="hash">{commit.hash}</div>
                          <div className="date">{commit.date}</div>
                        </div>
                      </foreignObject>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Load More */}
          <div className="p-6 pt-0">
            <Button
              variant="outline"
              className="w-full bg-card/50 border-border/50 hover:bg-accent/20 text-foreground transition-all duration-200"
              size="sm"
            >
              Load More Commits
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Commit Detail Modal */}
      <CommitDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        commit={selectedCommit}
      />
    </div>
  );
}
