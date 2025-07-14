import GitCommitGraph from "@/components/GitCommitGraph";
import GitHeader from "@/components/GitHeader";
import GitModal from "@/components/GitModal";
import GitSidebar from "@/components/GitSidebar";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Clock,
  GitBranch,
  GitCommit,
  GitMerge,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Index() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "commit" | "branch" | "merge" | "clone";
  }>({
    isOpen: false,
    type: "commit",
  });

  const [currentRepository, setCurrentRepository] =
    useState<string>("my-awesome-project");
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    if (typeof window !== "undefined" && window.electronAPI) {
      setIsElectron(true);

      // Listen for menu-triggered actions
      const handleCommitModal = () => openModal("commit");
      const handleBranchModal = () => openModal("branch");
      const handleMergeModal = () => openModal("merge");
      const handleCloneModal = () => openModal("clone");
      const handleRepositoryOpened = (event: any, path: string) => {
        const repoName =
          path.split("/").pop() || path.split("\\").pop() || "Unknown";
        setCurrentRepository(repoName);
        window.electronAPI.repositoryChanged(path);
      };

      // Set up listeners
      window.electronAPI.onOpenCommitModal(handleCommitModal);
      window.electronAPI.onOpenBranchModal(handleBranchModal);
      window.electronAPI.onOpenMergeModal(handleMergeModal);
      window.electronAPI.onOpenCloneModal(handleCloneModal);
      window.electronAPI.onRepositoryOpened(handleRepositoryOpened);

      // Cleanup
      return () => {
        window.electronAPI.removeCommitModalListener(handleCommitModal);
        window.electronAPI.removeBranchModalListener(handleBranchModal);
        window.electronAPI.removeMergeModalListener(handleMergeModal);
        window.electronAPI.removeCloneModalListener(handleCloneModal);
        window.electronAPI.removeRepositoryOpenedListener(
          handleRepositoryOpened,
        );
      };
    }
  }, []);

  const openModal = (type: "commit" | "branch" | "merge" | "clone") => {
    setModalState({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "commit" });
  };

  const projectStats = {
    totalCommits: 247,
    contributors: 8,
    branches: 12,
    lastCommit: "2 hours ago",
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-accent/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-secondary/5 via-transparent to-transparent rounded-full blur-2xl" />
      </div>

      {/* Electron titlebar spacer for macOS */}
      {isElectron && window.electronAPI.platform === "darwin" && (
        <div className="h-6 bg-layout-header border-b border-border drag glass-subtle" />
      )}

      {/* Header with glassmorphism */}
      <div className="relative z-10">
        <GitHeader currentRepository={currentRepository} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Sidebar with enhanced background */}
        <div className="relative">
          <GitSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Action Bar with Glassmorphism */}
          <div className="px-6 py-4 bg-layout-panel/80 backdrop-blur-md border-b border-border/50 glass-subtle">
            <div className="flex items-center justify-between">
              {/* Primary Actions with enhanced styling */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => openModal("commit")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 glass-subtle"
                  size="sm"
                >
                  <GitCommit className="w-4 h-4 mr-2" />
                  Commit
                  <Sparkles className="w-3 h-3 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openModal("branch")}
                  className="border-border/50 hover:bg-accent/50 glass-subtle backdrop-blur-sm"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Branch
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openModal("merge")}
                  className="border-border/50 hover:bg-accent/50 glass-subtle backdrop-blur-sm"
                  size="sm"
                >
                  <GitMerge className="w-4 h-4 mr-2" />
                  Merge
                </Button>
              </div>

              {/* Repository Stats with enhanced dividers */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <Activity className="w-4 h-4" />
                  <span className="font-semibold text-foreground">
                    {projectStats.totalCommits}
                  </span>
                  <span>commits</span>
                </div>
                <div className="divider-gradient h-6 w-px" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-git-green rounded-full" />
                  <Users className="w-4 h-4" />
                  <span className="font-semibold text-foreground">
                    {projectStats.contributors}
                  </span>
                  <span>contributors</span>
                </div>
                <div className="divider-gradient h-6 w-px" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-git-purple rounded-full" />
                  <GitBranch className="w-4 h-4" />
                  <span className="font-semibold text-foreground">
                    {projectStats.branches}
                  </span>
                  <span>branches</span>
                </div>
                <div className="divider-gradient h-6 w-px" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Last commit {projectStats.lastCommit}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Git Tree Visualization */}
          <div className="flex-1 overflow-hidden relative">
            <GitCommitGraph />
          </div>
        </div>
      </div>

      {/* Git Modal with glassmorphism */}
      <GitModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
      />
    </div>
  );
}
