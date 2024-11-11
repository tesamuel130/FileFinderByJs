const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function filterFilesBySizeAndMove(folderPath, maxSize, destinationFolder) {
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

        // Check the file size
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for file '${file}': ${err}`);
            return;
          }

          // If file size is equal to the specified max size, move it
          if (stats.size === maxSize) {
            console.log(
              `File '${filePath}' meets the size requirement (${stats.size} bytes)`
            );

            // Open the file
            openFile(filePath);

            // Move the file
            moveFile(filePath, destinationFolder);
          }
        });
      }
    });
  });
}

// Function to open a file using the default text editor
function openFile(filePath) {
  const platform = process.platform;

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
  const fileName = path.basename(filePath);
  const newFilePath = path.join(destinationFolder, fileName);

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
const folderPath = "C:\\Users\\hp\\Desktop\\aaa"; // Replace with the path to your source folder
const maxSize = 1873; // 1.83 KB in bytes
const destinationFolder = "C:\\Users\\hp\\Desktop\\fillsize"; // Replace with the path to your destination folder

filterFilesBySizeAndMove(folderPath, maxSize, destinationFolder);
