const { ipcRenderer } = require("electron");
const marked = require("marked");

const renderSide = document.getElementById("render-side");
const textArea = document.getElementById("edit-area");
const recentlyOpenFiles = document.getElementById("left-side");

const openFileButton = document.getElementById("open-file");
const newFileButton = document.getElementById("new-file");
const saveFileButton = document.getElementById("save-file");

openFileButton.addEventListener("click", (event) => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-file", (event, path, content) => {
  const div = document.createElement("div");
  div.style.overflowY = "scroll";
  div.style.height = "87%";
  div.style.padding = "0.5rem";
  div.innerHTML = marked(content);
  renderSide.appendChild(div);
});
