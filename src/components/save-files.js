const { ipcRenderer } = require("electron");
const fs = require("fs");
const {
  mdDisplay,
  editDisplay,
  editTitle,
  saveModalTitle,
} = require("./html-elements");
const { openFile } = require("./open-files-helper");
const { updateRecentFiles } = require("./recent-files");
const { toggleModal } = require("./save-files-helper");

const saveFileButton = document.getElementById("save-file");
const saveChanges = document.getElementById("save-changes");
const dontSaveChanges = document.getElementById("dont-save-changes");
const saveCancel = document.getElementById("save-cancel");

saveFileButton.addEventListener("click", () => {
  save();
  makeTextAreaEqual();
});

saveChanges.addEventListener("click", async () => {
  save();
  resetEditingArea();
  toggleModal();
  checkModalState();
});
dontSaveChanges.addEventListener("click", () => {
  resetEditingArea();
  toggleModal();
  checkModalState();
});
saveCancel.addEventListener("click", toggleModal);

ipcRenderer.on("save-new-file", (event, path) => {
  console.log(changedText.content);
  fs.writeFileSync(path, changedText.content);
  // saveAndDisplayRecentlyOpenFiles(path);
  toggleModal();
  modalState = MODAL_STATES.NONE;
});

function save() {
  if (changedText.content === initialText.content) {
    return;
  }
  if (fs.existsSync(changedText.path)) {
    fs.writeFileSync(changedText.path, changedText.content);
  } else {
    ipcRenderer.send("save-file-dialog");
  }
}

function resetEditingArea() {
  changedText = { ...EMPTY_CHANGED_TEXT };
  initialText = { ...EMPTY_INITIAL_TEXT };
  mdDisplay.innerHTML = changedText.content;
  editDisplay.value = initialText.content;
  editTitle.textContent = "New Untitled.md";
  saveModalTitle.textContent = CHANGE_FILE_TITLE();
}

function makeTextAreaEqual() {
  initialText.content = changedText.content;
}

function checkModalState() {
  console.log(changedText, initialText);
  if (modalState === MODAL_STATES.OPEN) {
    ipcRenderer.send("open-file-dialog");
  } else if (modalState === MODAL_STATES.RECENT) {
    openFile(recentPath);
    updateRecentFiles(recentPath);
  }
  modalState = MODAL_STATES.NONE;
}

module.exports = {
  resetEditingArea,
};
