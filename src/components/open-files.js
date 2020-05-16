const { ipcRenderer } = require("electron");
const { toggleModal } = require("./save-files-helper");
const { updateRecentFiles } = require("./recent-files");
const { openFileButton } = require("./html-elements");
const { openFile } = require("./open-files-helper");

openFileButton.addEventListener("click", () => {
  if (changedText.content !== initialText.content) {
    modalState = MODAL_STATES.OPEN;
    toggleModal();
  } else {
    ipcRenderer.send("open-file-dialog");
  }
});

ipcRenderer.on("selected-file", (event, path) => {
  openFile(path, updateRecentFiles);
});
