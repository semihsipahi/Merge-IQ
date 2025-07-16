const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  dialog,
  shell,
} = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

let mainWindow;

// GitKraken-inspired custom menu
const createMenu = () => {
  const template = [
    {
      label: "MergeIQ",
      submenu: [
        {
          label: "About MergeIQ",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About MergeIQ",
              message: "MergeIQ",
              detail:
                "A modern Git GUI application built with Electron and React.",
              buttons: ["OK"],
            });
          },
        },
        { type: "separator" },
        {
          label: "Preferences...",
          accelerator: "CmdOrCtrl+,",
          click: () => {
            // Open preferences window
            console.log("Open preferences");
          },
        },
        { type: "separator" },
        {
          label: "Quit MergeIQ",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "Open Repository...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openDirectory"],
              title: "Select Git Repository",
            });

            if (!result.canceled && result.filePaths.length > 0) {
              // Send repository path to renderer
              mainWindow.webContents.send(
                "repository-opened",
                result.filePaths[0],
              );
            }
          },
        },
        {
          label: "Clone Repository...",
          accelerator: "CmdOrCtrl+Shift+O",
          click: () => {
            mainWindow.webContents.send("open-clone-modal");
          },
        },
        { type: "separator" },
        {
          label: "Recent Repositories",
          submenu: [{ label: "No recent repositories", enabled: false }],
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectall" },
      ],
    },
    {
      label: "Repository",
      submenu: [
        {
          label: "Commit",
          accelerator: "CmdOrCtrl+Enter",
          click: () => {
            mainWindow.webContents.send("open-commit-modal");
          },
        },
        {
          label: "Pull",
          accelerator: "CmdOrCtrl+Shift+L",
          click: () => {
            mainWindow.webContents.send("git-pull");
          },
        },
        {
          label: "Push",
          accelerator: "CmdOrCtrl+P",
          click: () => {
            mainWindow.webContents.send("git-push");
          },
        },
        { type: "separator" },
        {
          label: "Create Branch...",
          accelerator: "CmdOrCtrl+B",
          click: () => {
            mainWindow.webContents.send("open-branch-modal");
          },
        },
        {
          label: "Merge Branch...",
          accelerator: "CmdOrCtrl+M",
          click: () => {
            mainWindow.webContents.send("open-merge-modal");
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  // macOS specific menu adjustments
  if (process.platform === "darwin") {
    template[0].submenu.splice(1, 0, { type: "separator" });

    template[0].submenu.splice(2, 0, {
      label: "Services",
      role: "services",
      submenu: [],
    });

    template[0].submenu.splice(4, 0, {
      label: "Hide MergeIQ",
      accelerator: "Command+H",
      role: "hide",
    });

    template[0].submenu.splice(5, 0, {
      label: "Hide Others",
      accelerator: "Command+Shift+H",
      role: "hideothers",
    });

    template[0].submenu.splice(6, 0, {
      label: "Show All",
      role: "unhide",
    });

    // Window menu
    template[5].submenu = [
      { role: "close" },
      { role: "minimize" },
      { role: "zoom" },
      { type: "separator" },
      { role: "front" },
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

const createWindow = () => {
  // Create the browser window with GitKraken-like styling
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    vibrancy: process.platform === "darwin" ? "sidebar" : null,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
    icon:
      process.platform === "win32"
        ? path.join(__dirname, "../public/icon.ico")
        : undefined,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:8080");
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/spa/index.html"));
  }

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    // Focus on window
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
};

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for communication with renderer
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("show-save-dialog", async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-open-dialog", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, options);
  return result;
});

ipcMain.handle("show-message-box", async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

// Handle repository operations
ipcMain.on("repository-changed", (event, repoPath) => {
  // Update window title with repository name
  const repoName = path.basename(repoPath);
  mainWindow.setTitle(`MergeIQ - ${repoName}`);
});
