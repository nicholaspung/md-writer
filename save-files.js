const { ipcRenderer } = require("electron");
const fs = require("fs");

const mdDisplay = document.getElementById("render-text");
const editDisplay = document.getElementById("edit-area");
const editTitle = document.getElementById("edit-title");
const saveFileButton = document.getElementById("save-file");

const saveModal = document.getElementById("save-modal");
const saveChanges = document.getElementById("save-changes");
const dontSaveChanges = document.getElementById("dont-save-changes");
const saveCancel = document.getElementById("save-cancel");

saveFileButton.addEventListener("click", (event) => {
  save();
});

saveChanges.addEventListener("click", async () => {
  save();
  resetEditingArea();
});
dontSaveChanges.addEventListener("click", () => {
  resetEditingArea();
  toggleModal();
});
saveCancel.addEventListener("click", toggleModal);

ipcRenderer.on("save-new-file", (event, path) => {
  fs.writeFileSync(path, changedText.content);
  saveAndDisplayRecentlyOpenFiles(path);
  toggleModal();
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
  changedText = { ...emptyChangedText };
  initialText = { ...emptyInitialText };
  mdDisplay.innerHTML = changedText.content;
  editDisplay.value = initialText.content;
  editTitle.textContent = "New File";
}

function toggleModal() {
  saveModal.classList.toggle("hide-modal");
  saveModal.classList.toggle("modal");
}

module.exports = {
  toggleModal,
};
