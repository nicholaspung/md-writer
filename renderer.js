const { ipcRenderer } = require("electron");
const marked = require("marked");
const fs = require("fs");
const path = require("path");

// state
let openedFiles = [];
let renderSideMeta = { content: "", path: "" };
let textAreaMeta = { content: "" };
const recentlyOpenFilesTxt = path.resolve("./recentlyOpenFiles.txt");

// dom elements
const mdDisplay = document.getElementById("render-side");
const editDisplay = document.getElementById("edit-area");
const openFileButton = document.getElementById("open-file");
const newFileButton = document.getElementById("new-file");
const saveFileButton = document.getElementById("save-file");
const recentDisplay = document.getElementById("recently-opened");

// main
displayRecentlyOpenFilesTxt();

// event listeners
openFileButton.addEventListener("click", () => {
  ipcRenderer.send("open-file-dialog");
});

editDisplay.addEventListener("input", (event) => {
  const renderText = document.getElementById("render-text");
  if (renderText) {
    renderText.innerHTML = marked(event.target.value);
    renderSideMeta.content = event.target.value;
  } else {
    createRenderTextNode(event.target.value);
  }
});

saveFileButton.addEventListener("click", (event) => {
  if (renderSideMeta.content === textAreaMeta.content) {
    return;
  }
  if (fs.existsSync(renderSideMeta.path)) {
    fs.writeFileSync(renderSideMeta.path, textAreaMeta.content);
  } else {
    ipcRenderer.send("save-file-dialog");
  }
});

// ipc
ipcRenderer.on("selected-file", (event, path, content) => {
  // render
  if (document.getElementById("render-text")) {
    const renderText = document.getElementById("render-text");
    renderText.innerHTML = marked(content);
  } else {
    createRenderTextNode(content);
  }
  renderSideMeta.content = content;
  renderSideMeta.path = path[0];
  // edit
  editDisplay.value = content;
  textAreaMeta.content = content;
  // fs
  if (!openedFiles.find((p) => p === path[0])) {
    saveAndDisplayRecentlyOpenFiles(path[0]);
  }
});

ipcRenderer.on("new-file", (event, path) => {
  fs.writeFileSync(path, textAreaMeta.content);
  saveAndDisplayRecentlyOpenFiles(path);
});

// helpers
function save() {
  if (renderSideMeta.content === textAreaMeta.content) {
    return;
  }
  if (fs.existsSync(renderSideMeta.path)) {
    fs.writeFileSync(renderSideMeta.path, textAreaMeta.content);
  } else {
    ipcRenderer.send("save-file-dialog");
  }
}

function displayRecentlyOpenFilesTxt() {
  if (fs.existsSync(recentlyOpenFilesTxt)) {
    const openFiles = fs.readFileSync(recentlyOpenFilesTxt, "utf8");
    if (openFiles.length > 0) {
      // removes old recentDisplay content
      if (recentDisplay.childNodes.length > 0) {
        recentDisplay.textContent = "";
      }

      openedFiles = openFiles.split("///n").filter((t) => Boolean(t));
      openedFiles.forEach(createRecentFilesNodes);
    }
  } else {
    fs.writeFileSync(recentlyOpenFilesTxt, "");
  }
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

function createRecentFilesNodes(file) {
  // for windows
  const display = file.slice(file.lastIndexOf("\\") + 1, file.length);
  const li = document.createElement("li");
  li.innerHTML = display;
  recentDisplay.appendChild(li);
}

function createRenderTextNode(content) {
  const div = document.createElement("div");
  div.id = "render-text";
  div.innerHTML = marked(content);
  mdDisplay.appendChild(div);
}

function saveAndDisplayRecentlyOpenFiles(path) {
  saveAndDisplayRecentlyOpenFiles(path);
  displayRecentlyOpenFilesTxt();
}
