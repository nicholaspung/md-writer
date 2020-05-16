const marked = require("marked");
const fs = require("fs");
const {
  mdDisplay,
  editDisplay,
  editTitle,
  saveModalTitle,
} = require("./html-elements");

const fileName = (path) => path.slice(path.lastIndexOf("\\") + 1);

function openFile(path, cb) {
  const content = fs.readFileSync(path, "utf8");
  // render
  mdDisplay.innerHTML = marked(content);
  changedText.content = content;
  changedText.path = path;

  // edit
  editDisplay.value = content;
  initialText.content = content;

  // title
  editTitle.textContent = `Editing: ${fileName(path)}`;
  saveModalTitle.textContent = CHANGE_FILE_TITLE(fileName(path));

  // reset modal state
  modalState = MODAL_STATES.NONE;
  if (cb) {
    cb(path);
  }
}

module.exports = {
  fileName,
  openFile,
};
