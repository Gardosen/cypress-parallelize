import fs from "fs";
const { scope } = require("./scope");

export function assignTestRunnerAnnotation(options){
    console.log("Test Runner Assignment");
    const filesToHandle = options.specFile != null? [options.specFile] : scope.FEATURE_FILE_LIST;

    const filesHandled = filesToHandle.map(file => {
        console.log(`Handling file ${file}`);
        addTagToScenariosOfFile(file);
        return file;
    });

    console.log(`Successfully handled ${filesHandled.length} feature files.`);
}

function addTagToScenariosOfFile(file, options) {
    console.log(`Assigning Test Runners to file [${file}]`);
    const lines = fs.readFileSync(file, "utf-8").split('\n');
    const newLines = lines.map(line => {
        if (line.includes(options.tests) && !line.includes(`${scope.RUNNER_ANNOTATION}${scope.RUNNER_NUMBER}`)) {
            console.log(`Adding ${scope.RUNNER_ANNOTATION}${scope.RUNNER_NUMBER} to line [${line}]`);
            line = line + ` ${scope.RUNNER_ANNOTATION}${scope.RUNNER_NUMBER}`;
            scope.RUNNER_NUMBER = (scope.RUNNER_NUMBER++%options.amount)+1;
        }
        return line;
    });

    fs.writeFileSync(file, newLines.join('\n'), err => {
        if (err) throw err;
    });
}