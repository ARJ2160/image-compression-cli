#! /usr/bin/env node
import fs from "fs";
import path from "path";
import sharp from "sharp";
const inquirer = require("inquirer");
import { questions, acceptedImageTypes } from "../constants/constants";

function compressImages(inputPath: string, outputPath = inputPath) {
  fs.readdir(inputPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const originalSizes: number[] = [];

    const imageFiles = files.filter((file) => {
      // Store original image sizes
      fs.stat(inputPath + "/" + file, (err, stats) => {
        if (err) {
          console.log(`File doesn't exist.`);
        } else {
          originalSizes.push(stats.size);
        }
      });
      const ext = path.extname(file).toLowerCase();
      return acceptedImageTypes.includes(ext);
    });

    imageFiles.forEach((image, i) => {
      let inputFilePath = path.join(inputPath, image);
      let outputFilePath = "";

      if (outputPath === inputPath) {
        let newFileName =
          image.slice(0, image.lastIndexOf(".")) +
          " Compressed" +
          image.slice(image.lastIndexOf("."));

        outputFilePath = path.join(inputPath, newFileName);
      } else {
        outputFilePath = path.join(outputPath, image);
      }

      sharp(inputFilePath).toFile(outputFilePath, (err, info) => {
        if (err) {
          console.log("Error compressing image:", err);
          return;
        }
        console.log(
          `Compressed '${image}' from ${originalSizes[i]} bytes => ${
            info.size
          } bytes (${(info.size / 1024).toFixed(2)} KB)`
        );
      });
    });
  });
}

let inputPath = "";
let outputPath = "";

inquirer.prompt(questions).then((answers: any) => {
  inputPath = answers.inputPath;
  outputPath = answers.outputPath;

  // Check if inputPath isnt provided
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

  if (outputPath === "") {
    outputPath = inputPath;
  }

  compressImages(inputPath, outputPath);
});
