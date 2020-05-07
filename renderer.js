const { ipcRenderer } = require("electron");
const marked = require("marked");
const fs = require("fs");
const path = require("path");

let openedFiles = [];

const recentlyOpenFiles = document.getElementById("recently-opened");
const recentlyOpenFilesTxt = path.resolve("./recentlyOpenFiles.txt");
function displayRecentlyOpenFilesTxt() {
  if (fs.existsSync(recentlyOpenFilesTxt)) {
    const openFiles = fs.readFileSync(recentlyOpenFilesTxt, "utf8");
    if (openFiles.length > 0) {
      if (recentlyOpenFiles.childNodes.length > 0) {
        recentlyOpenFiles.textContent = "";
      }
      openedFiles = openFiles.split("///n").filter((t) => Boolean(t));
      console.log(openedFiles);
      openedFiles.forEach((file) => {
        const li = document.createElement("li");
        li.style.padding = "1rem";
        li.innerHTML = file;
        recentlyOpenFiles.appendChild(li);
      });
    }
  } else {
    fs.writeFileSync(recentlyOpenFilesTxt, "");
  }
}
displayRecentlyOpenFilesTxt();

function correctOrderWithAddedPath(path) {
  const pathIndex = openedFiles.findIndex((p) => p === path);
  if (pathIndex !== -1) {
    openedFiles.splice(pathIndex, 1);
  }
  if (openedFiles.length === 5) {
    openedFiles.splice(0, 1);
  }
  return [...openedFiles, path];
}

function saveToRecentlyOpenFilesTxt(path) {
  const filePaths = correctOrderWithAddedPath(path);
  let txt = "";
  for (let i = filePaths.length - 1; i >= 0; i -= 1) {
    txt += filePaths[i];
    txt += "///n";
  }
  fs.writeFileSync(recentlyOpenFilesTxt, txt);
}

let renderSideMeta = { content: "", path: "" };
let textAreaMeta = { content: "" };

const renderSide = document.getElementById("render-side");
const textArea = document.getElementById("edit-area");

const openFileButton = document.getElementById("open-file");
const newFileButton = document.getElementById("new-file");
const saveFileButton = document.getElementById("save-file");

openFileButton.addEventListener("click", () => {
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-file", (event, path, content) => {
  // render
  if (document.getElementById("render-text")) {
    const renderText = document.getElementById("render-text");
    renderText.innerHTML = marked(content);
  } else {
    const div = document.createElement("div");
    div.id = "render-text";
    div.style.overflowY = "scroll";
    div.style.height = "87%";
    div.style.padding = "0.5rem";
    div.innerHTML = marked(content);
    renderSide.appendChild(div);
  }
  renderSideMeta.content = content;
  renderSideMeta.path = path[0];
  // edit
  textArea.value = content;
  textAreaMeta.content = content;
  // fs
  if (!openedFiles.find((p) => p === path[0])) {
    saveToRecentlyOpenFilesTxt(path[0]);
    displayRecentlyOpenFilesTxt();
  }
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
