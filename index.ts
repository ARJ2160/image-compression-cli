import fs from "fs";
import path from "path";
import sharp from "sharp";
import { acceptedImageTypes } from "./constants";

function compressImages(inputPath: string, outputPath = inputPath) {
  fs.readdir(inputPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return acceptedImageTypes.includes(ext);
    });

    imageFiles.forEach((image) => {
      const inputFilePath = path.join(inputPath, image);
      const outputFilePath = path.join(outputPath, image);
      sharp(inputFilePath).toFile(outputFilePath, (err, info) => {
        if (err) {
          console.log("Error compressing image:", err);
          return;
        }
        console.log(`Compressed ${image} to ${info.size} bytes`);
      });
    });
  });
}

const args = process.argv.slice(2);
const inputPath = args[0];
const outputPath = args[1];

// Check if inputPath is provided
if (!inputPath) {
  console.error("Please provide a directory path as input");
  process.exit(1);
}

// Check if inputPath exists
if (!fs.existsSync(inputPath)) {
  console.error("Input directory does not exist");
  process.exit(1);
}

// If outputPath is provided, check if it exists, otherwise create it
if (outputPath && !fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

compressImages(inputPath, outputPath);
