const { ipcRenderer } = require("electron");
const marked = require("marked");
const { toggleModal } = require("./save-files");

const mdDisplay = document.getElementById("render-text");
const editDisplay = document.getElementById("edit-area");
const openFileButton = document.getElementById("open-file");
const editTitle = document.getElementById("edit-title");
const saveModalTitle = document.getElementById("save-modal-title");

openFileButton.addEventListener("click", () => {
  if (changedText.content !== initialText.content) {
    modalState = MODAL_STATES.OPEN;
    toggleModal();
  } else {
    ipcRenderer.send("open-file-dialog");
  }
});

ipcRenderer.on("selected-file", (event, path, content) => {
  // render
  mdDisplay.innerHTML = marked(content);
  changedText.content = content;
  changedText.path = path[0];

  // edit
  editDisplay.value = content;
  initialText.content = content;

  // title
  editTitle.textContent = `Editing: ${fileName(path[0])}`;
  saveModalTitle.textContent = CHANGE_FILE_TITLE(fileName(path[0]));

  // reset modal state
  modalState = MODAL_STATES.NONE;
});

const fileName = (path) => path.slice(path.lastIndexOf("\\") + 1);

module.exports = {
  fileName,
};
