import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitBranch,
  GitCommit,
  GitMerge,
  Copy,
  ExternalLink,
  Clock,
  FileText,
  Plus,
  Minus,
  Eye,
  Download,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  File,
  Folder,
} from "lucide-react";

interface FileChange {
  path: string;
  type: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  oldPath?: string;
  diff: string;
  staged: boolean;
}

interface CommitDetail {
  id: string;
  hash: string;
  message: string;
  description?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  committer: {
    name: string;
    email: string;
  };
  date: string;
  timeAgo: string;
  branch: string;
  type: "commit" | "merge" | "branch";
  filesChanged: number;
  additions: number;
  deletions: number;
  branchColor: string;
  parents: string[];
  children: string[];
  files: FileChange[];
}

interface CommitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  commit: CommitDetail | null;
}

const mockDiff = `@@ -1,7 +1,7 @@
 import React from 'react';
 import { Button } from '@/components/ui/button';
 
-export default function LoginForm() {
+export default function AuthForm() {
   const [email, setEmail] = useState('');
-  const [password, setPassword] = useState('');
+  const [password, setPassword] = useState('password123');
 
   return (
@@ -15,6 +15,12 @@ export default function LoginForm() {
         value={password}
         onChange={(e) => setPassword(e.target.value)}
       />
+      <div className="mt-4">
+        <label className="text-sm font-medium">
+          Remember me
+        </label>
+        <input type="checkbox" className="ml-2" />
+      </div>
       <Button type="submit" className="w-full mt-4">
-        Login
+        Sign In
       </Button>`;

export default function CommitDetailModal({
  isOpen,
  onClose,
  commit,
}: CommitDetailModalProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileStates, setFileStates] = useState<Record<string, boolean>>({});

  if (!commit) return null;

  const toggleFileStaging = (filePath: string) => {
    setFileStates((prev) => ({
      ...prev,
      [filePath]: !prev[filePath],
    }));
  };

  const getFileIcon = (type: string, path: string) => {
    if (path.includes("/")) {
      return <Folder className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "added":
        return "text-git-green";
      case "deleted":
        return "text-git-red";
      case "modified":
        return "text-git-blue";
      case "renamed":
        return "text-git-orange";
      default:
        return "text-muted-foreground";
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "added":
        return <Plus className="w-3 h-3" />;
      case "deleted":
        return <Minus className="w-3 h-3" />;
      case "modified":
        return <FileText className="w-3 h-3" />;
      case "renamed":
        return <ExternalLink className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const renderDiffLine = (line: string, index: number) => {
    const lineType = line[0];
    let className = "font-mono text-sm px-4 py-1 ";

    switch (lineType) {
      case "+":
        className +=
          "bg-git-green/10 text-git-green border-l-2 border-git-green";
        break;
      case "-":
        className += "bg-git-red/10 text-git-red border-l-2 border-git-red";
        break;
      case "@":
        className += "bg-accent text-muted-foreground font-semibold";
        break;
      default:
        className += "text-foreground";
    }

    return (
      <div key={index} className={className}>
        <span className="select-none text-muted-foreground mr-4 w-8 inline-block">
          {index + 1}
        </span>
        {line}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] bg-card border-border p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-semibold text-foreground mb-2">
                  {commit.message}
                </DialogTitle>
                {commit.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {commit.description}
                  </p>
                )}

                {/* Commit metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={commit.author.avatar} />
                      <AvatarFallback className="text-xs bg-secondary">
                        {commit.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {commit.author.name}
                    </span>
                  </div>

                  <Separator orientation="vertical" className="h-3" />

                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{commit.timeAgo}</span>
                  </div>

                  <Separator orientation="vertical" className="h-3" />

                  <code className="text-xs font-mono bg-secondary px-2 py-1 rounded">
                    {commit.hash}
                  </code>

                  <Separator orientation="vertical" className="h-3" />

                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0"
                    style={{
                      borderColor: commit.branchColor,
                      color: commit.branchColor,
                    }}
                  >
                    <GitBranch className="w-3 h-3 mr-1" />
                    {commit.branch}
                  </Badge>

                  {commit.type === "merge" && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        <GitMerge className="w-3 h-3 mr-1" />
                        merge
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 min-h-0">
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <div className="px-6 pt-4 flex-shrink-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="files">
                    Changed Files ({commit.filesChanged})
                  </TabsTrigger>
                  <TabsTrigger value="diff">Diff View</TabsTrigger>
                  <TabsTrigger value="stats">Statistics</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="files" className="flex-1 min-h-0 m-0">
                <div className="flex h-full">
                  {/* File list */}
                  <div className="w-80 border-r border-border">
                    <div className="p-4 border-b border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {commit.filesChanged} files changed
                        </span>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-git-green">
                            +{commit.additions}
                          </span>
                          <span className="text-git-red">
                            -{commit.deletions}
                          </span>
                        </div>
                      </div>
                    </div>

                    <ScrollArea className="h-[calc(100%-73px)]">
                      <div className="p-2">
                        {commit.files.map((file) => (
                          <div
                            key={file.path}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                              selectedFile === file.path
                                ? "bg-accent"
                                : "hover:bg-accent/50"
                            }`}
                            onClick={() => setSelectedFile(file.path)}
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className={getFileTypeColor(file.type)}>
                                {getFileIcon(file.type, file.path)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm truncate">
                                  {file.path.split("/").pop()}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {file.path}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-git-green">
                                  +{file.additions}
                                </span>
                                <span className="text-git-red">
                                  -{file.deletions}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFileStaging(file.path);
                                }}
                              >
                                {fileStates[file.path] ? (
                                  <CheckCircle className="w-3 h-3 text-git-green" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* File diff */}
                  <div className="flex-1">
                    {selectedFile ? (
                      <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={getFileTypeColor(
                                  commit.files.find(
                                    (f) => f.path === selectedFile,
                                  )?.type || "modified",
                                )}
                              >
                                {getFileTypeIcon(
                                  commit.files.find(
                                    (f) => f.path === selectedFile,
                                  )?.type || "modified",
                                )}
                              </div>
                              <span className="font-mono text-sm">
                                {selectedFile}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <ScrollArea className="flex-1">
                          <div className="bg-card">
                            {mockDiff
                              .split("\n")
                              .map((line, index) =>
                                renderDiffLine(line, index),
                              )}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Select a file to view its changes</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="diff" className="flex-1 min-h-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-6">
                    <div className="bg-card border border-border rounded-lg">
                      {mockDiff
                        .split("\n")
                        .map((line, index) => renderDiffLine(line, index))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="stats" className="flex-1 min-h-0 m-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-card p-4 rounded-lg border">
                        <div className="text-2xl font-semibold text-foreground">
                          {commit.filesChanged}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Files Changed
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg border">
                        <div className="text-2xl font-semibold text-git-green">
                          +{commit.additions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Additions
                        </div>
                      </div>
                      <div className="bg-card p-4 rounded-lg border">
                        <div className="text-2xl font-semibold text-git-red">
                          -{commit.deletions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Deletions
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
