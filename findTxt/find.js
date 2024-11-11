const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function searchWordInTxtFiles(folderPath, searchWord, destinationFolder) {
  // Check if the specified folder exists
  if (!fs.existsSync(folderPath)) {
    console.log(`The folder '${folderPath}' does not exist.`);
    return;
  }

  // Check if the destination folder exists
  if (!fs.existsSync(destinationFolder)) {
    console.log(
      `The destination folder '${destinationFolder}' does not exist.`
    );
    return;
  }

  // Read the contents of the folder
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading folder: ${err}`);
      return;
    }

    // Iterate through each file in the folder
    files.forEach((file) => {
      // Check if the file is a .txt file
      if (file.endsWith(".txt")) {
        const filePath = path.join(folderPath, file);

        // Read the .txt file
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error(`Error reading file '${file}': ${err}`);
            return;
          }

          // Split file content into lines
          const lines = data.split("\n");
          let found = false; // Flag to track if the word was found

          // Search for the input word in each line
          lines.forEach((line, lineNumber) => {
            if (line.includes(searchWord)) {
              console.log(
                `Found '${searchWord}' in '${filePath}' on line ${
                  lineNumber + 1
                }: ${line.trim()}`
              );
              found = true;
            }
          });

          // Open the file and move it if the word was found
          if (found) {
            openFile(filePath);
            moveFile(filePath, destinationFolder);
          }
        });
      }
    });
  });
}

// Function to open a file using the default text editor
function openFile(filePath) {
  const platform = process.platform; // Get the current platform

  let command;
  if (platform === "win32") {
    command = `start "" "${filePath}"`; // Windows
  } else if (platform === "darwin") {
    command = `open "${filePath}"`; // macOS
  } else {
    command = `xdg-open "${filePath}"`; // Linux
  }

  exec(command, (err) => {
    if (err) {
      console.error(`Error opening file: ${err}`);
    }
  });
}

// Function to move a file to a new destination
function moveFile(filePath, destinationFolder) {
  const fileName = path.basename(filePath); // Get the file name
  const newFilePath = path.join(destinationFolder, fileName); // Create new path in destination folder

  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      console.error(
        `Error moving file '${filePath}' to '${destinationFolder}': ${err}`
      );
    } else {
      console.log(`Moved '${filePath}' to '${newFilePath}'`);
    }
  });
}

// Example usage
const folderPath = "C:\\Users\\hp\\Desktop\\kkkk"; // Replace with the path to your folder
const searchWord = "SUMMARY"; // Replace with the word you want to search for
const destinationFolder = "C:\\Users\\hp\\Desktop\\newBine"; // Replace with the path to your destination folder

searchWordInTxtFiles(folderPath, searchWord, destinationFolder);
