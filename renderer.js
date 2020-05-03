const { ipcRenderer } = require("electron");

const renderSide = document.getElementById("render-side");
const textArea = document.getElementById("edit-area");
const recentlyOpenFiles = document.getElementById("left-side");

const openFileButton = document.getElementById("open-file");
const newFileButton = document.getElementById("new-file");
const saveFileButton = document.getElementById("save-file");

openFileButton.addEventListener("click", (event) => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-directory", (event, path) => {
  document.getElementById("selected-file").innerHTML = `You selected: ${path}`;
});
