import fs from "node:fs";
import YAML from "yaml"

const dirToScan = "src/_includes/components";
const dryRun = false; // Set to false to actually rename files

(async () => {
  const scannedComponentFiles = await fs.promises.readdir(dirToScan, { recursive: true })
  const componentsToRegister = []
  const structureFilesToProcess = []

  for (const file of scannedComponentFiles) {
    const filePath = `${dirToScan}/${file}`
    const stats = await fs.promises.stat(filePath);
    if (stats.isDirectory()) {
      console.log('File', filePath, ' is a directory - skipping write')
      continue;
    }

    // Handle .liquid -> .liquid renames
    if (stats.isFile() && file.endsWith(".liquid")) {
      const newFilePath = filePath.replace('.eleventy.liquid', '.liquid');
      const newFileName = file.replace('.eleventy.liquid', '.liquid');

      if (dryRun) {
        console.log(`[DRY RUN] Would rename: ${filePath} -> ${newFilePath}`);
      } else {
        try {
          await fs.promises.rename(filePath, newFilePath);
          console.log(`Renamed: ${filePath} -> ${newFilePath}`);
        } catch (err) {
          console.error(`Failed to rename ${filePath}:`, err.message);
        }
      }

      componentsToRegister.push({
        name: newFileName,
        file: newFilePath,
        originalFile: filePath
      });
    }

    // Handle .bookshop.yml -> .cloudcannon.structure-value.yml renames
    if (stats.isFile() && file.endsWith(".bookshop.yml")) {
      const newFilePath = filePath.replace('.bookshop.yml', '.cloudcannon.structure-value.yml');
      const newFileName = file.replace('.bookshop.yml', '.cloudcannon.structure-value.yml');

      const oldYmlFile = await fs.promises.readFile(filePath, 'utf8');
      const oldYmlFileContents = YAML.parse(oldYmlFile)

      const ymlFileContentsToWrite = {};

      ymlFileContentsToWrite.label = oldYmlFileContents.spec.label
      ymlFileContentsToWrite.icon = oldYmlFileContents.spec.icon
      ymlFileContentsToWrite.tags = oldYmlFileContents.spec.tags || []
      ymlFileContentsToWrite.value = oldYmlFileContents.blueprint
      if (oldYmlFileContents._inputs) {
        ymlFileContentsToWrite._inputs = oldYmlFileContents._inputs
      }
      if (oldYmlFileContents._structures) {
        ymlFileContentsToWrite._structures = oldYmlFileContents._structures
      }

      console.log({ ymlFileContentsToWrite })

      if (dryRun) {
        console.log(`[DRY RUN] Would rename: ${filePath} -> ${newFilePath}`);
      } else {
        try {
          await fs.promises.writeFile(newFilePath, YAML.stringify(ymlFileContentsToWrite));
          await fs.promises.rm(filePath);
          console.log(`Renamed: ${filePath} -> ${newFilePath}`);
        } catch (err) {
          console.error(`Failed to rename ${filePath}:`, err.message);
        }
      }

      structureFilesToProcess.push({
        name: newFileName,
        file: newFilePath,
        originalFile: filePath
      });
    }
  }

  console.log({ componentsToRegister })
  // console.log({ structureFilesToProcess })
})()