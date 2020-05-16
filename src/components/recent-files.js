const fs = require("fs");
const path = require("path");
const { toggleModal } = require("./save-files-helper");
const { openFile } = require("./open-files-helper");

const recentDisplay = document.getElementById("recently-opened");

// on load, either creates file or reads file
displayRecentlyOpenedFileNames();

function displayRecentlyOpenedFileNames() {
  if (fs.existsSync(recentFilesPath)) {
    const recentFilesBuffer = fs.readFileSync(recentFilesPath, "utf8");
    if (recentFilesBuffer.length > 0) {
      // reset display
      if (recentDisplay.childNodes.length > 0) {
        recentDisplay.textContent = "";
      }
      const recentFiles = JSON.parse(recentFilesBuffer).reverse();
      // create list
      recentFiles.forEach(createRecentFilesNodes);
      // set state
      openedFiles = recentFiles;
    }
  } else {
    fs.writeFileSync(recentFilesPath, JSON.stringify(openedFiles));
  }
}

function createRecentFilesNodes(path) {
  const text = path.slice(path.lastIndexOf("\\") + 1);
  const li = document.createElement("li");
  li.innerHTML = text;
  li.addEventListener("click", openRecentFile);
  recentDisplay.appendChild(li);
}

function updateRecentFiles(path) {
  if (openedFiles.includes(path)) {
    openedFiles.splice(openedFiles.indexOf(path), 1);
  }
  openedFiles.reverse();
  openedFiles.push(path);
  if (openedFiles.length > 5) {
    openedFiles.shift();
  }
  fs.writeFileSync(recentFilesPath, JSON.stringify(openedFiles));
  displayRecentlyOpenedFileNames();
}

function openRecentFile(event) {
  const openPath = path.resolve(`./${event.target.innerHTML}`);
  if (changedText.content !== initialText.content) {
    modalState = MODAL_STATES.RECENT;
    recentPath = openPath;
    console.log(changedText.path);
    toggleModal();
  } else {
    openFile(openPath);
    updateRecentFiles(openPath);
  }
}

module.exports = {
  updateRecentFiles,
};
