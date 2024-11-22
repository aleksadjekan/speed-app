const { app, BrowserWindow, Tray } = require("electron");
const path = require("path");
const { toggleWindow } = require("./utils");

app.whenReady().then(() => {
  const tray = new Tray(path.join(__dirname, "./24x24.png"));

  app.dock.hide();

  const browserWindow = new BrowserWindow({
    width: 250,
    height: 250,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  browserWindow.webContents.openDevTools();

  browserWindow.loadFile("./index.html");

  tray.addListener("mouse-up", () => {
    toggleWindow(browserWindow, tray);
  });

  tray.setToolTip("Internet speed infos");
});
