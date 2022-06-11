const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");
const keywords = require("./settings.js");

function getFileNamesFromDirectory(directory) {
  return new Promise((res, rej) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        rej(err);
      }
      res(files);
    });
  });
}

function processFile(inputDirectory, file, outputDirectory) {
  const wordCount = new Map();

  keywords.forEach((keyword) => {
    wordCount.set(keyword.toLowerCase(), { appearances: 0, pages: [] });
  });

  let pageNumber = 0;

  function processItem(item, res) {
    if (!item) {
      const fileName = path.join(
        outputDirectory,
        `${path.parse(file).name}.json`
      );

      fs.writeFileSync(fileName, JSON.stringify(Object.fromEntries(wordCount)));
      return res("complete");
    }

    if (item.page) {
      pageNumber = item.page;
      return;
    }

    if (!item.text) return;
    const currentLine = String(item.text).toLowerCase();

    wordCount.forEach((value, key, map) => {
      if (currentLine.includes(key)) {
        map.set(key, {
          ...value,
          appearances: value.appearances + 1,
          pages: [...value.pages, pageNumber],
        });
      }
    });
  }

  return new Promise((res, rej) => {
    new PdfReader().parseFileItems(
      path.join(inputDirectory, file),
      (err, item) => {
        if (err) return rej(err);
        processItem(item, res);
      }
    );
  });
}

module.exports = async () => {
  return getFileNamesFromDirectory("./data")
    .then((files) => {
      return Promise.allSettled(
        files.map((file) => {
          if (path.extname(file) != ".pdf") return Promise.resolve();
          return processFile("./data", file, "./results");
        })
      );
    })
    .catch((err) => {
      console.error("error", err);
      return Promise.reject(err);
    });
};
