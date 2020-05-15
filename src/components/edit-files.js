const marked = require("marked");

const editDisplay = document.getElementById("edit-area");
const mdDisplay = document.getElementById("render-text");

editDisplay.addEventListener("input", (event) => {
  mdDisplay.innerHTML = marked(event.target.value);
  changedText.content = event.target.value;
});
