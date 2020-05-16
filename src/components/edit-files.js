const marked = require("marked");
const { editDisplay, mdDisplay } = require("./html-elements");

editDisplay.addEventListener("input", (event) => {
  mdDisplay.innerHTML = marked(event.target.value);
  changedText.content = event.target.value;
});
