import path from "path";
import fs from "fs";
const { scope } = require("./scope");

export function cleanFeatureFiles(options) {
    const filesToClean = options.specFile ? [options.specFile] : scope.FEATURE_FILE_LIST;

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
        if (line.includes(scope.RUNNER_ANNOTATION)) {
            return line.replace(new RegExp(`\s{0,}${scope.RUNNER_ANNOTATION}\d+`, "g"), "");
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, handledData);
    console.log(`Successfully removed all ${scope.RUNNER_ANNOTATION}X annotation in ${filePath}`);
}

