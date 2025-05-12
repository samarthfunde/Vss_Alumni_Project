const fs = require("fs");

// Function to check for unescaped single quotes
function hasUnescapedSingleQuote(str) {
  // Matches a single quote not followed by another single quote
  return /'(?!')/.test(str);
}

const filePath = "./SqlDatabase/db1.sql";
const lines = fs.readFileSync(filePath, "utf-8").split("\n");

let found = false;
lines.forEach((line, idx) => {
  if (hasUnescapedSingleQuote(line)) {
    found = true;
    console.log(`Unescaped single quote found on line ${idx + 1}:`);
    console.log(line);
  }
});

if (!found) {
  console.log("No unescaped single quotes found!");
}
