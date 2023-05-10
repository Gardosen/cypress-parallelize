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
            return line.replace(new RegExp(`\\s*${scope.options.runnerAnnotation}\\d+`, "g"), "");
        }
        return line;
    }).join('\n');

    fs.writeFileSync(filePath, handledData);
    console.log(`Successfully removed all ${scope.options.runnerAnnotation} annotation in ${filePath}`);
}

export function removeReportFolders() {
    const regex = new RegExp(`${scope.options.allureReportFolderName}-${scope.options.runnerAnnotation}-\\d`); // Sucht nach Ordnern, die mit "old_" beginnen
    const folders = fs.readdirSync(process.cwd(), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && regex.test(dirent.name))
        .map(dirent => `${process.cwd()}/${dirent.name}`);


    folders.forEach((folder) => {
        try {
            fs.rm(folder, { recursive: true}, ()=>{});
            console.log(`Folder ${folder} has been deleted.`);
        } catch (err) {
            console.error(`Could not delete folder ${folder}:`, err);
        }
    });
}

export function removeRunnerLogFolder() {
    fs.rm(path.join(process.cwd(), "runner-logs"), {recursive: true}, ()=>{});
}

