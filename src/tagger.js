import fs from "fs";
const scope = require("./scope");

export function assignTestRunnerAnnotation(){
    console.log("Test Runner Assignment");
    const filesToHandle = scope.options.specFile != null? [scope.options.specFile] : scope.featureFileList;

    const filesHandled = filesToHandle.map(file => {
        console.log(`Handling file ${file}`);
        addTagToScenariosOfFile(file);
        return file;
    });

    console.log(`Successfully handled ${filesHandled.length} feature files.`);
}

function addTagToScenariosOfFile(file) {
    console.log(`Assigning Test Runners to file [${file}]`);
    const lines = fs.readFileSync(file, "utf-8").split('\n');
    const newLines = lines.map(line => {
        if (line.includes(scope.options.tests) && !line.includes(`${scope.options.runnerAnnotation}${scope.runnerNumber}`)) {
            console.log(`Adding ${scope.options.runnerAnnotation}${scope.runnerNumber} to line [${line}]`);
            line = line + ` ${scope.options.runnerAnnotation}${scope.runnerNumber}`;
            scope.runnerNumber = (scope.runnerNumber++%scope.options.runnerAmount)+1;
            scope.runnerAmmountAssigned++;
        }
        return line;
    });

    fs.writeFileSync(file, newLines.join('\n'), err => {
        if (err) throw err;
    });
}