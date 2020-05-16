const { ipcRenderer } = require("electron");
const marked = require("marked");
const fs = require("fs");
const path = require("path");

// constants
const EMPTY_CHANGED_TEXT = Object.freeze({ content: "", path: "" });
const EMPTY_INITIAL_TEXT = Object.freeze({ content: "" });
const MODAL_STATES = Object.freeze({
  OPEN: "OPEN",
  NEW: "NEW",
  RECENT: "RECENT",
  NONE: "NONE",
});
const CHANGE_FILE_TITLE = (name = "Untitled.md") =>
  `Do you want to save the changes you made to "${name}"?`;

// state
let openedFiles = [];
let changedText = { ...EMPTY_CHANGED_TEXT };
let initialText = { ...EMPTY_INITIAL_TEXT };
let modalState = MODAL_STATES.NONE;
let fileTitle = "";
let recentPath = "";
// makeshift database, probably can use JSON.stringify() and JSON.parse()
const recentFilesPath = path.resolve("./recently-open-files.txt");

require("./components/html-elements");
require("./components/open-files-helper");
require("./components/save-files-helper");

require("./components/edit-files");
require("./components/save-files");
require("./components/open-files");
require("./components/new-files");
require("./components/recent-files");

// dom elements
// const mdDisplay = document.getElementById("render-side");
// const editDisplay = document.getElementById("edit-area");
// const openFileButton = document.getElementById("open-file");
// const newFileButton = document.getElementById("new-file");
// const saveFileButton = document.getElementById("save-file");
// const recentDisplay = document.getElementById("recently-opened");
// const renderText = document.getElementById("render-text");
// const editTitle = document.getElementById("edit-title");
// // dom elements save modal
// const saveModal = document.getElementById("save-modal");
// const saveModalPath = document.getElementById("save-modal-path");
// const saveChanges = document.getElementById("save-changes");
// const dontSaveChanges = document.getElementById("dont-save-changes");
// const saveCancel = document.getElementById("save-cancel");

// // main
// displayRecentlyOpenFilesTxt();

// // event listeners
// openFileButton.addEventListener("click", () => {
//   ipcRenderer.send("open-file-dialog");
// });

// editDisplay.addEventListener("input", (event) => {
//   renderText.innerHTML = marked(event.target.value);
//   renderSideMeta.content = event.target.value;
//   textAreaMeta.content = event.target.value;
// });

// saveFileButton.addEventListener("click", (event) => {
//   if (renderSideMeta.content === textAreaMeta.content) {
//     return;
//   }
//   if (fs.existsSync(renderSideMeta.path)) {
//     fs.writeFileSync(renderSideMeta.path, textAreaMeta.content);
//   } else {
//     ipcRenderer.send("save-file-dialog");
//   }
//   saveModal.id.toggle;
// });

// newFileButton.addEventListener("click", (event) => {
//   if (renderSideMeta.content === textAreaMeta.content) {
//     resetEditingArea();
//   } else {
//     // open modal asking if they want to save current file
//     if (renderSideMeta.path) {
//       saveModalPath.textContent = `Do you want to save the changes you made to ${renderSideMeta.path}`;
//     }
//     toggleModal();
//   }
// });

// // modal event listeners
// saveChanges.addEventListener("click", async () => {
//   save();
//   resetEditingArea();
// });
// dontSaveChanges.addEventListener("click", () => {
//   resetEditingArea();
//   toggleModal();
// });
// saveCancel.addEventListener("click", toggleModal);

// // ipc
// ipcRenderer.on("selected-file", (event, path, content) => {
//   // render
//   renderText.innerHTML = marked(content);
//   renderSideMeta.content = content;
//   renderSideMeta.path = path[0];
//   // edit
//   editDisplay.value = content;
//   textAreaMeta.content = content;
//   // fs
//   if (!openedFiles.find((p) => p === path[0])) {
//     saveAndDisplayRecentlyOpenFiles(path[0]);
//   }
//   // title
//   editTitle.textContent = "Editing File";
// });

// ipcRenderer.on("new-file", (event, path) => {
//   fs.writeFileSync(path, textAreaMeta.content);
//   saveAndDisplayRecentlyOpenFiles(path);
//   toggleModal();
// });

// // helpers
// function save() {
//   if (renderSideMeta.content === textAreaMeta.content) {
//     return;
//   }
//   if (fs.existsSync(renderSideMeta.path)) {
//     fs.writeFileSync(renderSideMeta.path, textAreaMeta.content);
//   } else {
//     ipcRenderer.send("save-file-dialog");
//   }
// }

// function displayRecentlyOpenFilesTxt() {
//   if (fs.existsSync(recentlyOpenFilesTxt)) {
//     const openFiles = fs.readFileSync(recentlyOpenFilesTxt, "utf8");
//     if (openFiles.length > 0) {
//       // removes old recentDisplay content
//       if (recentDisplay.childNodes.length > 0) {
//         recentDisplay.textContent = "";
//       }

//       openedFiles = openFiles.split("///n").filter((t) => Boolean(t));
//       openedFiles.forEach(createRecentFilesNodes);
//     }
//   } else {
//     fs.writeFileSync(recentlyOpenFilesTxt, "");
//   }
// }

// function saveToRecentlyOpenFilesTxt(path) {
//   const filePaths = correctOrderWithAddedPath(path);
//   let txt = "";
//   for (let i = filePaths.length - 1; i >= 0; i -= 1) {
//     txt += filePaths[i];
//     txt += "///n";
//   }
//   fs.writeFileSync(recentlyOpenFilesTxt, txt);
// }

// function correctOrderWithAddedPath(path) {
//   const pathIndex = openedFiles.findIndex((p) => p === path);
//   if (pathIndex !== -1) {
//     openedFiles.splice(pathIndex, 1);
//   }
//   if (openedFiles.length === 5) {
//     openedFiles.splice(0, 1);
//   }
//   return [...openedFiles, path];
// }

// function createRecentFilesNodes(file) {
//   // for windows
//   const display = file.slice(file.lastIndexOf("\\") + 1, file.length);
//   const li = document.createElement("li");
//   li.innerHTML = display;
//   recentDisplay.appendChild(li);
// }

// function saveAndDisplayRecentlyOpenFiles(path) {
//   saveToRecentlyOpenFilesTxt(path);
//   displayRecentlyOpenFilesTxt();
// }

// function resetEditingArea() {
//   renderSideMeta = { ...emptyRenderSideMeta };
//   textAreaMeta = { ...emptyTextAreaMeta };
//   const renderText = document.getElementById("render-text");
//   renderText.innerHTML = renderSideMeta.content;
//   editDisplay.value = textAreaMeta.content;
//   editTitle.textContent = "New File";
// }

// function toggleModal() {
//   saveModal.classList.toggle("hide-modal");
//   saveModal.classList.toggle("modal");
// }
