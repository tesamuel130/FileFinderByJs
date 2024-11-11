const fs = require("fs");
const path = require("path");

function combineTxtFiles(folderPath, outputFile) {
  // Check if the specified folder exists
  if (!fs.existsSync(folderPath)) {
    console.log(`The folder '${folderPath}' does not exist.`);
    return;
  }

  // Read all files in the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading folder: ${err}`);
      return;
    }

    // Filter .txt files
    const txtFiles = files.filter((file) => file.endsWith(".txt"));

    // Use Promises to read and write files sequentially
    const fileReadPromises = txtFiles.map((file) => {
      const filePath = path.join(folderPath, file);
      return fs.promises
        .readFile(filePath, "utf8")
        .then((data) => `\n--- Content of ${file} ---\n\n${data}\n`);
    });

    // Combine all contents and write to the output file
    Promise.all(fileReadPromises)
      .then((contents) => {
        const combinedContent = contents.join("\n");
        return fs.promises.writeFile(outputFile, combinedContent, "utf8");
      })
      .then(() => {
        console.log(`All text files have been combined into '${outputFile}'`);
      })
      .catch((error) => {
        console.error(`Error combining files: ${error}`);
      });
  });
}

// Example usage
const folderPath = "C:/Users/hp/Desktop/kkkk"; // Replace with the path to your folder containing .txt files
const outputFile = "C:/Users/hp/Desktop/fillsize/combined.txt"; // Replace with the desired path for the output file

combineTxtFiles(folderPath, outputFile);
