const { app, BrowserWindow, Tray, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const { toggleWindow } = require("./utils");

app.whenReady().then(() => {
  const tray = new Tray(path.join(__dirname, "./public/24x24.png"));

  app.dock.hide();

  const browserWindow = new BrowserWindow({
    width: 200,
    height: 150,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  browserWindow.webContents.openDevTools();

  browserWindow.loadFile("dist/index.html");

  tray.addListener("mouse-up", () => {
    toggleWindow(browserWindow, tray);
  });

  ipcMain.on("set-title", (event, message) => {
    console.log("Received message in main process:", message);
  });

  runCommand(browserWindow);

  tray.setToolTip("Internet speed infos");
});

const sendSpeedUpdate = (window, value) => {
  window.webContents.send("speed-update", value);
};

const runCommand = (window) => {
  const { spawn } = require("node:child_process");

  var child = spawn("networkQuality");
  child.stdin.end();

  child.on("error", (err) => {
    console.log("stderr: <" + err + ">");
  });

  child.stdout.on("data", (data) => {
    const response = parseMessage(data.toString());
    sendSpeedUpdate(window, JSON.stringify(response));
  });

  child.stderr.on("data", (data) => {
    console.log("stderr: <" + data + ">");
  });

  child.on("close", (code) => {
    if (code === 0) {
      console.log("Process is finished");
    }
  });
};
const uplinkLabel = "Uplink capacity:";
const downlinkLabel = "Downlink capacity:";
const mbpsLabel = "Mbps";

const parseMessage = (message) => {
  const uplinkData = message.slice(
    message.indexOf(uplinkLabel) + uplinkLabel.length,
    message.indexOf(mbpsLabel) + mbpsLabel.length
  );

  // cut first parr
  let messageAfterUplink = message.slice(
    message.indexOf(mbpsLabel) + mbpsLabel.length
  );

  const downlinkData = messageAfterUplink.slice(
    messageAfterUplink.indexOf(downlinkLabel) + downlinkLabel.length,
    messageAfterUplink.indexOf(mbpsLabel) + mbpsLabel.length
  );

  console.log("Uplink capacity: ", uplinkData);
  console.log("Downlink capacity: ", downlinkData);

  return {
    uplink: uplinkData,
    downlink: downlinkData,
  };
};
