import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserProfile from "@/components/UserProfile";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Search,
  Settings,
  FolderOpen,
  RefreshCw,
  Zap,
} from "lucide-react";

interface GitHeaderProps {
  currentRepository?: string;
}

export default function GitHeader({
  currentRepository = "my-awesome-project",
}: GitHeaderProps) {
  return (
    <header className="h-14 bg-layout-header/80 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-4 glass-subtle">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg">
            <GitBranch className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
              MergeIQ
              <Zap className="w-4 h-4 text-primary" />
            </h1>
          </div>
        </div>

        <div className="divider-gradient h-6 w-px" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FolderOpen className="w-4 h-4" />
          <span className="font-medium text-foreground">
            {currentRepository}
          </span>
        </div>
      </div>

      {/* Center section - Enhanced Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search commits, branches, files..."
            className="pl-10 bg-secondary/50 border-border/50 glass-subtle backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 glass-subtle"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>

        <div className="divider-gradient h-6 w-px" />

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 glass-subtle"
        >
          <GitPullRequest className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 glass-subtle"
        >
          <GitMerge className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 glass-subtle"
        >
          <GitCommit className="w-4 h-4" />
        </Button>

        <div className="divider-gradient h-6 w-px" />

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent/50 glass-subtle"
        >
          <Settings className="w-4 h-4" />
        </Button>

        <UserProfile />
      </div>
    </header>
  );
}
