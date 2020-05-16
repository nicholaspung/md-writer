const { saveModal } = require("./html-elements");

function toggleModal() {
  saveModal.classList.toggle("hide-modal");
  saveModal.classList.toggle("modal");
}

module.exports = {
  toggleModal,
};
