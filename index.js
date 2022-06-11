const createResults = require("./createResults");
const displayResults = require("./displayResults");

createResults().then(() => {
  displayResults();
});
