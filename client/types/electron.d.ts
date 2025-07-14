export interface ElectronAPI {
  // App info
  getAppVersion: () => Promise<string>;

  // Dialog methods
  showSaveDialog: (options: any) => Promise<any>;
  showOpenDialog: (options: any) => Promise<any>;
  showMessageBox: (options: any) => Promise<any>;

  // Repository operations
  onRepositoryOpened: (callback: (event: any, path: string) => void) => void;
  removeRepositoryOpenedListener: (callback: any) => void;

  // Git operations triggered from menu
  onGitPull: (callback: (event: any) => void) => void;
  onGitPush: (callback: (event: any) => void) => void;
  removeGitPullListener: (callback: any) => void;
  removeGitPushListener: (callback: any) => void;

  // Modal operations triggered from menu
  onOpenCommitModal: (callback: (event: any) => void) => void;
  onOpenBranchModal: (callback: (event: any) => void) => void;
  onOpenMergeModal: (callback: (event: any) => void) => void;
  onOpenCloneModal: (callback: (event: any) => void) => void;

  removeCommitModalListener: (callback: any) => void;
  removeBranchModalListener: (callback: any) => void;
  removeMergeModalListener: (callback: any) => void;
  removeCloneModalListener: (callback: any) => void;

  // Send messages to main process
  repositoryChanged: (repoPath: string) => void;

  // Platform info
  platform: string;
}

export interface GitAPI {
  clone: (url: string, path: string) => Promise<void>;
  pull: (repoPath: string) => Promise<void>;
  push: (repoPath: string) => Promise<void>;
  commit: (repoPath: string, message: string, files: string[]) => Promise<void>;
  createBranch: (
    repoPath: string,
    branchName: string,
    fromBranch: string,
  ) => Promise<void>;
  mergeBranch: (
    repoPath: string,
    targetBranch: string,
    sourceBranch: string,
  ) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    gitAPI: GitAPI;
  }
}
