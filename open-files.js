const { ipcRenderer } = require("electron");
const marked = require("marked");
const { toggleModal } = require("./save-files");

const mdDisplay = document.getElementById("render-text");
const editDisplay = document.getElementById("edit-area");
const openFileButton = document.getElementById("open-file");
const editTitle = document.getElementById("edit-title");

openFileButton.addEventListener("click", () => {
  if (changedText.content !== initialText.content) {
    toggleModal();
    // need to figure out how to make this synchronous
  }
  ipcRenderer.send("open-file-dialog");
});

ipcRenderer.on("selected-file", (event, path, content) => {
  // render
  mdDisplay.innerHTML = marked(content);
  changedText.content = content;
  changedText.path = path[0];

  // edit
  editDisplay.value = content;

  // title
  editTitle.textContent = "Editing File";
});
