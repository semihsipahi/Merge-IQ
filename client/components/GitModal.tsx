import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GitCommit,
  GitBranch,
  GitMerge,
  FileText,
  Plus,
  Minus,
  AlertCircle,
} from "lucide-react";

interface GitModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "commit" | "branch" | "merge" | "clone";
}

export default function GitModal({ isOpen, onClose, type }: GitModalProps) {
  const [commitMessage, setCommitMessage] = useState("");
  const [branchName, setBranchName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const stagedFiles = [
    {
      name: "src/components/Header.tsx",
      status: "modified",
      additions: 12,
      deletions: 3,
    },
    {
      name: "src/styles/global.css",
      status: "modified",
      additions: 5,
      deletions: 1,
    },
    {
      name: "src/utils/helpers.ts",
      status: "added",
      additions: 20,
      deletions: 0,
    },
    { name: "README.md", status: "modified", additions: 8, deletions: 2 },
  ];

  const getModalTitle = () => {
    switch (type) {
      case "commit":
        return "Commit Changes";
      case "branch":
        return "Create Branch";
      case "merge":
        return "Merge Branch";
      case "clone":
        return "Clone Repository";
      default:
        return "Git Operation";
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case "commit":
        return <GitCommit className="w-5 h-5" />;
      case "branch":
        return <GitBranch className="w-5 h-5" />;
      case "merge":
        return <GitMerge className="w-5 h-5" />;
      default:
        return <GitCommit className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "added":
        return "git-green";
      case "modified":
        return "git-blue";
      case "deleted":
        return "git-red";
      default:
        return "muted";
    }
  };

  const renderCommitModal = () => (
    <div className="space-y-6">
      {/* Staged Files */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Staged Files</Label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stagedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3 text-git-green" />
                      {file.additions}
                    </span>
                    <span className="flex items-center gap-1">
                      <Minus className="w-3 h-3 text-git-red" />
                      {file.deletions}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs bg-${getStatusColor(file.status)}/10 border-${getStatusColor(file.status)}/20`}
              >
                {file.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Message */}
      <div className="space-y-3">
        <Label htmlFor="commit-message" className="text-sm font-medium">
          Commit Message
        </Label>
        <Textarea
          id="commit-message"
          placeholder="Enter a descriptive commit message..."
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertCircle className="w-3 h-3" />
          <span>Use conventional commit format for better tracking</span>
        </div>
      </div>

      {/* Commit Options */}
      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="simple" className="space-y-3">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="push-after-commit" className="rounded" />
            <label htmlFor="push-after-commit" className="text-sm">
              Push after commit
            </label>
          </div>
        </TabsContent>
        <TabsContent value="advanced" className="space-y-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="amend" className="rounded" />
              <label htmlFor="amend" className="text-sm">
                Amend previous commit
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="sign-commit" className="rounded" />
              <label htmlFor="sign-commit" className="text-sm">
                Sign commit
              </label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm">
                Author Override
              </Label>
              <Input
                id="author"
                placeholder="Name <email@example.com>"
                className="text-sm"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderBranchModal = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="branch-name" className="text-sm font-medium">
          Branch Name
        </Label>
        <Input
          id="branch-name"
          placeholder="feature/new-feature"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Create from</Label>
        <Select defaultValue="main">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">main</SelectItem>
            <SelectItem value="develop">develop</SelectItem>
            <SelectItem value="feature/user-auth">feature/user-auth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="checkout-branch"
          className="rounded"
          defaultChecked
        />
        <label htmlFor="checkout-branch" className="text-sm">
          Switch to new branch after creation
        </label>
      </div>
    </div>
  );

  const renderMergeModal = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Merge into</Label>
        <Select defaultValue="main">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">main</SelectItem>
            <SelectItem value="develop">develop</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Merge from</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select branch to merge" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feature/user-auth">feature/user-auth</SelectItem>
            <SelectItem value="bugfix/header-styling">
              bugfix/header-styling
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="no-ff" className="rounded" />
          <label htmlFor="no-ff" className="text-sm">
            Create merge commit (--no-ff)
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="squash" className="rounded" />
          <label htmlFor="squash" className="text-sm">
            Squash commits
          </label>
        </div>
      </div>
    </div>
  );

  const renderModalContent = () => {
    switch (type) {
      case "commit":
        return renderCommitModal();
      case "branch":
        return renderBranchModal();
      case "merge":
        return renderMergeModal();
      default:
        return <div>Content not implemented</div>;
    }
  };

  const getActionButtonText = () => {
    switch (type) {
      case "commit":
        return "Commit Changes";
      case "branch":
        return "Create Branch";
      case "merge":
        return "Merge Branch";
      default:
        return "Execute";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              {getModalIcon()}
            </div>
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        {renderModalContent()}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            {getActionButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
