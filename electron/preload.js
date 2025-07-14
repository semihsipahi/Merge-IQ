const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // App info
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // Dialog methods
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  showMessageBox: (options) => ipcRenderer.invoke("show-message-box", options),

  // Repository operations
  onRepositoryOpened: (callback) =>
    ipcRenderer.on("repository-opened", callback),
  removeRepositoryOpenedListener: (callback) =>
    ipcRenderer.removeListener("repository-opened", callback),

  // Git operations triggered from menu
  onGitPull: (callback) => ipcRenderer.on("git-pull", callback),
  onGitPush: (callback) => ipcRenderer.on("git-push", callback),
  removeGitPullListener: (callback) =>
    ipcRenderer.removeListener("git-pull", callback),
  removeGitPushListener: (callback) =>
    ipcRenderer.removeListener("git-push", callback),

  // Modal operations triggered from menu
  onOpenCommitModal: (callback) =>
    ipcRenderer.on("open-commit-modal", callback),
  onOpenBranchModal: (callback) =>
    ipcRenderer.on("open-branch-modal", callback),
  onOpenMergeModal: (callback) => ipcRenderer.on("open-merge-modal", callback),
  onOpenCloneModal: (callback) => ipcRenderer.on("open-clone-modal", callback),

  removeCommitModalListener: (callback) =>
    ipcRenderer.removeListener("open-commit-modal", callback),
  removeBranchModalListener: (callback) =>
    ipcRenderer.removeListener("open-branch-modal", callback),
  removeMergeModalListener: (callback) =>
    ipcRenderer.removeListener("open-merge-modal", callback),
  removeCloneModalListener: (callback) =>
    ipcRenderer.removeListener("open-clone-modal", callback),

  // Send messages to main process
  repositoryChanged: (repoPath) =>
    ipcRenderer.send("repository-changed", repoPath),

  // Platform info
  platform: process.platform,
});

// Additional context for Git operations
contextBridge.exposeInMainWorld("gitAPI", {
  // Git-specific operations will be added here
  // For now, we'll use placeholder functions
  clone: async (url, path) => {
    console.log("Clone repository:", url, "to", path);
    // Implement git clone functionality
  },

  pull: async (repoPath) => {
    console.log("Pull repository:", repoPath);
    // Implement git pull functionality
  },

  push: async (repoPath) => {
    console.log("Push repository:", repoPath);
    // Implement git push functionality
  },

  commit: async (repoPath, message, files) => {
    console.log("Commit to repository:", repoPath, message, files);
    // Implement git commit functionality
  },

  createBranch: async (repoPath, branchName, fromBranch) => {
    console.log(
      "Create branch:",
      branchName,
      "from",
      fromBranch,
      "in",
      repoPath,
    );
    // Implement git branch creation functionality
  },

  mergeBranch: async (repoPath, targetBranch, sourceBranch) => {
    console.log(
      "Merge branch:",
      sourceBranch,
      "into",
      targetBranch,
      "in",
      repoPath,
    );
    // Implement git merge functionality
  },
});
