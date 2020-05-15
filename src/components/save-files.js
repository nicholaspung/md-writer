const { ipcRenderer } = require("electron");
const fs = require("fs");

const mdDisplay = document.getElementById("render-text");
const editDisplay = document.getElementById("edit-area");
const editTitle = document.getElementById("edit-title");
const saveFileButton = document.getElementById("save-file");

const saveModal = document.getElementById("save-modal");
const saveModalTitle = document.getElementById("save-modal-title");
const saveChanges = document.getElementById("save-changes");
const dontSaveChanges = document.getElementById("dont-save-changes");
const saveCancel = document.getElementById("save-cancel");

saveFileButton.addEventListener("click", (event) => {
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

function toggleModal() {
  saveModal.classList.toggle("hide-modal");
  saveModal.classList.toggle("modal");
}

function makeTextAreaEqual() {
  initialText.content = changedText.content;
}

function checkModalState() {
  if (modalState === MODAL_STATES.OPEN) {
    ipcRenderer.send("open-file-dialog");
  } else if (modalState === MODAL_STATES.NEW) {
    return;
  }
}

module.exports = {
  toggleModal,
  resetEditingArea,
};
