import path from "path";
import fs from "fs";
const scope = require("./scope");
const scanner = require('./scanner');
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
    if(!scope.options.dryRun) {
        const data = fs.readFileSync(filePath, 'utf8').split('\n');
        const handledData = data.map(line => {
            if (line.includes(scope.options.runnerAnnotation)) {
                return line.replace(new RegExp(`\\s*${scope.options.runnerAnnotation}\\d+`, "g"), "");
            }
            return line;
        }).join('\n');

        fs.writeFileSync(filePath, handledData);
    }
    logger.log(`Successfully removed all ${scope.options.runnerAnnotation} annotation in ${filePath}`);
}

export function removeReportFolders() {
    logger.log("Removing Report folders of the previous runners");

    const folders = scanner.getFolderListByRegExp(new RegExp(`${scope.options.allureRunnerReportFolderName}`));
    folders.forEach((folder) => {
        if(!scope.options.dryRun)
            remove(folder);
    });
}

export function removeRunnerLogFolder(logFolderPath) {
    remove(logFolderPath);
}

export function remove(element){
    fs.rmSync(element, {recursive: true, force: true});
}

