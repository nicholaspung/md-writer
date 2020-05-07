const { ipcRenderer } = require("electron");
const marked = require("marked");
const fs = require("fs");
const path = require("path");

let openedFiles = [];

const recentlyOpenFilesTxt = path.resolve("./recentlyOpenFiles.txt");
if (fs.existsSync(recentlyOpenFilesTxt)) {
  openFiles = fs.readFileSync(recentlyOpenFilesTxt);
  if (openFiles.length > 0) {
    openFiles = openFiles.split("/n");
  }
} else {
  fs.writeFileSync(recentlyOpenFilesTxt, "");
}

let renderSideMeta = { content: "", path: "" };
let textAreaMeta = { content: "" };

const renderSide = document.getElementById("render-side");
const textArea = document.getElementById("edit-area");
const recentlyOpenFiles = document.getElementById("left-side");

const openFileButton = document.getElementById("open-file");
const newFileButton = document.getElementById("new-file");
const saveFileButton = document.getElementById("save-file");

openFileButton.addEventListener("click", () => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-file", (event, path, content) => {
  // render
  const div = document.createElement("div");
  div.id = "render-text";
  div.style.overflowY = "scroll";
  div.style.height = "87%";
  div.style.padding = "0.5rem";
  div.innerHTML = marked(content);
  renderSide.appendChild(div);
  renderSideMeta.content = content;
  renderSideMeta.path = path[0];
  // edit
  textArea.value = content;
  textAreaMeta.content = content;
});

textArea.addEventListener("input", (event) => {
  const renderText = document.getElementById("render-text");
  if (renderText) {
    renderText.innerHTML = marked(event.target.value);
    renderSideMeta.content = event.target.value;
  }
});

saveFileButton.addEventListener("click", (event) => {
  if (renderSideMeta.content === textAreaMeta.content) {
    return;
  }
  fs.writeFileSync(renderSideMeta.path, textAreaMeta.content);
});
