import path from "path";
import fs from "fs";
const scope = require("./scope");
const logger = require("./logger");

export function cleanFeatureFiles() {
    const filesToClean = scope.options.spec ? [scope.options.spec] : scope.featureFileList;

    const cleanedFiles = filesToClean.map(file => {
        removeRunnerTagFromFile(file);
        return file;
    });

    logger.log(`Successfully cleaned ${cleanedFiles.length} feature files.`);
}

function removeRunnerTagFromFile(file) {
    const filePath = path.resolve(file);

    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const handledData = data.map(line => {
        if (line.includes(scope.options.runnerAnnotation)) {
            return line.replace(new RegExp(`\\s*${scope.options.runnerAnnotation}\\d+`, "g"), "");
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, handledData);
    logger.log(`Successfully removed all ${scope.options.runnerAnnotation} annotation in ${filePath}`);
}

export function removeReportFolders() {
    logger.log("Removing Report folders of the previous runners");
    const regex = new RegExp(`${scope.options.allureReportFolderName}${scope.options.runnerAnnotation}\\d`);
    const folders = fs.readdirSync(process.cwd(), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && regex.test(dirent.name))
        .map(dirent => `${process.cwd()}/${dirent.name}`);


    folders.forEach((folder) => {
        try {
            fs.rm(folder, { recursive: true}, ()=>{});
            logger.log(`Folder ${folder} has been deleted.`);
        } catch (err) {
            logger.error(`Could not delete folder ${folder}:`, err);
        }
    });
}

export function removeRunnerLogFolder(logFolderPath) {
    fs.rm(logFolderPath, {recursive: true}, ()=>{});
}

