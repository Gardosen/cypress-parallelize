import path from "path";
import fs from "fs";
const scope = require("./scope");

export function cleanFeatureFiles() {
    const filesToClean = scope.options.specFile ? [scope.options.specFile] : scope.featureFileList;

    const cleanedFiles = filesToClean.map(file => {
        removeRunnerTagFromFile(file);
        return file;
    });

    console.log(`Successfully cleaned ${cleanedFiles.length} feature files.`);
}

function removeRunnerTagFromFile(file) {
    const filePath = path.resolve(file);

    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const handledData = data.map(line => {
        if (line.includes(scope.options.runnerAnnotation)) {
            console.log(`Going to return line ${line.replace(new RegExp(`\s{0,}${scope.options.runnerAnnotation}\d+`, "g"), "")}`);
            return line.replace(new RegExp(`\s{0,}${scope.options.runnerAnnotation}\d+`, "g"), "");
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, handledData);
    console.log(`Successfully removed all ${scope.options.runnerAnnotation} annotation in ${filePath}`);
}

