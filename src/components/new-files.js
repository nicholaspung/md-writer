const { toggleModal } = require("./save-files-helper");
const { resetEditingArea } = require("./save-files");

const newFileButton = document.getElementById("new-file");
const saveModalTitle = document.getElementById("save-modal-title");

newFileButton.addEventListener("click", (event) => {
  if (changedText.content === initialText.content) {
    resetEditingArea();
    saveModalTitle.text = CHANGE_FILE_TITLE();
  } else {
    modalState = MODAL_STATES.NEW;
    toggleModal();
  }
});
