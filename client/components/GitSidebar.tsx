import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  FolderGit2,
  GitBranch,
  GitCommit,
  GitMerge,
  History,
  Plus,
  Sparkles,
  Tag,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";

export default function GitSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    local: true,
    remote: true,
    tags: false,
    changes: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const localBranches = [
    { name: "main", isActive: true, commits: 12 },
    { name: "feature/user-auth", isActive: false, commits: 8 },
    { name: "bugfix/header-styling", isActive: false, commits: 3 },
    { name: "develop", isActive: false, commits: 24 },
  ];

  const remoteBranches = [
    { name: "origin/main", commits: 12 },
    { name: "origin/develop", commits: 24 },
    { name: "origin/feature/user-auth", commits: 8 },
  ];

  const tags = [
    { name: "v1.0.0", date: "2024-01-15" },
    { name: "v0.9.2", date: "2024-01-10" },
    { name: "v0.9.1", date: "2024-01-05" },
  ];

  // Mock data for changes
  const changes = [
    {
      type: "folder",
      name: "src",
      children: [
        {
          type: "file",
          name: "App.tsx",
          added: 10,
          removed: 2,
        },
        {
          type: "file",
          name: "main.tsx",
          added: 3,
          removed: 0,
        },
        {
          type: "folder",
          name: "components",
          children: [
            {
              type: "file",
              name: "Header.tsx",
              added: 0,
              removed: 1,
            },
            {
              type: "file",
              name: "Sidebar.tsx",
              added: 2,
              removed: 2,
            },
          ],
        },
      ],
    },
    {
      type: "file",
      name: "package.json",
      added: 1,
      removed: 0,
    },
  ];

  // Recursive render for changes tree
  function renderChangesTree(nodes: any[], level = 0) {
    return (
      <div className={level === 0 ? "space-y-1" : "pl-4 space-y-1"}>
        {nodes.map((node, idx) => {
          if (node.type === "folder") {
            return (
              <div key={node.name + idx}>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <span>{node.name}</span>
                </div>
                {renderChangesTree(node.children, level + 1)}
              </div>
            );
          } else {
            return (
              <div key={node.name + idx} className="flex items-center gap-2 p-2 rounded hover:bg-accent/30 transition-colors">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="flex-1 truncate text-sm">{node.name}</span>
                <span className="text-xs text-git-green font-mono">+{node.added}</span>
                <span className="text-xs text-git-red font-mono">-{node.removed}</span>
              </div>
            );
          }
        })}
      </div>
    );
  }

  return (
    <aside className="w-72 bg-layout-sidebar/80 backdrop-blur-md border-r border-border/50 flex flex-col glass-subtle">
      {/* Enhanced Repository Info */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center glass-subtle">
            <FolderGit2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate flex items-center gap-2">
              my-awesome-project
              <Sparkles className="w-3 h-3 text-primary" />
            </h2>
            <p className="text-sm text-muted-foreground">
              main • 24 commits behind
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Enhanced Quick Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-1 bg-primary rounded-full" />
              Quick Actions
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 glass-subtle"
                size="sm"
              >
                <GitCommit className="w-4 h-4 mr-3" />
                Commit Changes
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 glass-subtle"
                size="sm"
              >
                <GitMerge className="w-4 h-4 mr-3" />
                Pull Changes
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 glass-subtle"
                size="sm"
              >
                <History className="w-4 h-4 mr-3" />
                View History
              </Button>
            </div>
          </div>

          {/* Changes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleSection("changes")}
                className="flex items-center gap-2 text-xs font-semibold text-git-yellow uppercase tracking-wider hover:text-foreground transition-colors"
              >
                {expandedSections.changes ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <div className="w-1 h-1 bg-git-yellow rounded-full" />
                Changes
              </button>
              <Badge variant="secondary" className="text-xs h-5 gradient-secondary border-0">
                {changes.reduce((acc, node) => {
                  if (node.type === "file") return acc + 1;
                  if (node.type === "folder") return acc + (node.children?.length || 0);
                  return acc;
                }, 0)}
              </Badge>
            </div>
            {expandedSections.changes && (
              <div>
                {renderChangesTree(changes)}
              </div>
            )}
          </div>

          <div className="divider-gradient h-px w-full" />

          {/* Enhanced Local Branches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleSection("local")}
                className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
              >
                {expandedSections.local ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <div className="w-1 h-1 bg-git-blue rounded-full" />
                Local Branches
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-accent/50 glass-subtle"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {expandedSections.local && (
              <div className="space-y-1">
                {localBranches.map((branch) => (
                  <div
                    key={branch.name}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      branch.isActive
                        ? "bg-primary/10 text-primary glass-subtle border border-primary/20"
                        : "hover:bg-accent/30 text-foreground glass-subtle"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <GitBranch className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-sm truncate">{branch.name}</span>
                      {branch.isActive && (
                        <Circle className="w-1.5 h-1.5 fill-current flex-shrink-0" />
                      )}
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs h-5 gradient-secondary border-0"
                    >
                      {branch.commits}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Remote Branches */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("remote")}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              {expandedSections.remote ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <div className="w-1 h-1 bg-git-green rounded-full" />
              Remote Branches
            </button>

            {expandedSections.remote && (
              <div className="space-y-1">
                {remoteBranches.map((branch) => (
                  <div
                    key={branch.name}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-all duration-200 glass-subtle"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <GitBranch className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-sm truncate">{branch.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs h-5 glass-subtle border-border/50"
                    >
                      {branch.commits}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Tags */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("tags")}
              className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              {expandedSections.tags ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <div className="w-1 h-1 bg-git-orange rounded-full" />
              Tags
            </button>

            {expandedSections.tags && (
              <div className="space-y-1">
                {tags.map((tag) => (
                  <div
                    key={tag.name}
                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-all duration-200 glass-subtle"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm truncate font-medium">
                          {tag.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tag.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="divider-gradient h-px w-full" />

          {/* Enhanced Team */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-1 bg-git-purple rounded-full" />
              Team
            </h3>
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-accent/50 glass-subtle"
                size="sm"
              >
                <Users className="w-4 h-4 mr-3" />
                Contributors
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs h-5 gradient-secondary border-0"
                >
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
