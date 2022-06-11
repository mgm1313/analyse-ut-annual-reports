const fs = require("fs");
const path = require("path");
const keywords = require("./settings.js");

function generateTableHTML(array) {
  var result = "<table border='1' style='border-collapse:collapse'>";
  var header = array[0];

  result += "<tr>";
  for (var i = 0; i < header.length; i++) {
    Array.isArray(header[i])
      ? (result += `<th colspan="2">${header[i][0]}</th>`)
      : (result += `<th rowspan="2">${header[i]}</th>`);
  }
  result += "</tr><tr>";

  for (var i = 0; i < header.length; i++) {
    Array.isArray(header[i])
      ? (result += `<th>${header[i][1][0]}</th><th>${header[i][1][1]}</th>`)
      : null;
  }
  result += "</tr>";
  var val;
  for (var i = 1; i < array.length; i++) {
    result += "<tr>";
    for (var j = 0; j < array[i].length; j++) {
      val = array[i][j];
      if (Array.isArray(val)) {
        val.forEach((cell) => {
          result += "<td>" + cell + "</td>";
        });
      } else {
        result += "<td>" + val + "</td>";
      }
    }
    result += "</tr>";
  }
  result += "</table>";

  return result;
}

module.exports = () => {
  const resultsDirectory = fs
    .readdirSync("./results")
    .filter((file) => path.extname(file) === ".json");

  const wordCount = new Map();

  keywords.forEach((keyword) => {
    wordCount.set(keyword.toLowerCase(), new Map());
  });

  resultsDirectory.forEach((file) => {
    const fileData = fs.readFileSync(path.join("./results", file));
    const json = JSON.parse(fileData.toString());

    Object.keys(json).forEach((key) => {
      if (!wordCount.has(key)) return;

      const value = json[key];
      wordCount.set(
        key,
        wordCount
          .get(key)
          .set(file, { appearances: value.appearances, pages: value.pages })
      );
    });
  });

  const wordCountArray = Array.from(wordCount.entries());
  const tabularArray = [
    [
      "Word",
      ...resultsDirectory.map((fileName) => {
        return [fileName, ["# appearances", "seen on pages"]];
      }),
    ],
    ...wordCountArray.map(([keyword, map]) => {
      return [
        keyword,
        ...Array.from(map.entries()).map(([_file, value]) => {
          return [value.appearances, value.pages];
        }),
      ];
    }),
  ];

  fs.writeFileSync("./results/output/res.json", JSON.stringify(tabularArray));

  fs.writeFileSync(
    "./results/output/index.html",
    generateTableHTML(tabularArray)
  );
};
