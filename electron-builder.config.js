module.exports = {
  appId: "com.mergeiq.electron",
  productName: "MergeIQ",
  directories: {
    output: "dist-electron",
  },
  files: [
    "dist/spa/**/*",
    "electron/**/*",
    {
      from: "node_modules",
      to: "node_modules",
      filter: [
        "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
      ],
    },
  ],
  extraResources: [
    {
      from: "public",
      to: "public",
      filter: ["**/*"],
    },
  ],
  mac: {
    category: "public.app-category.developer-tools",
    target: {
      target: "dmg",
      arch: ["x64", "arm64"],
    },
    icon: "public/icon.icns",
  },
  win: {
    target: {
      target: "nsis",
      arch: ["x64"],
    },
    icon: "public/icon.ico",
  },
  linux: {
    target: {
      target: "AppImage",
      arch: ["x64"],
    },
    icon: "public/icon.png",
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },
};
