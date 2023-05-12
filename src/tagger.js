import fs from "fs";
const scope = require("./scope");
const logger = require("./logger");


export function assignTestRunnerAnnotation(){
    logger.log("Test Runner Assignment");
    const filesToHandle = scope.options.spec != null? [scope.options.spec] : scope.featureFileList;

    const filesHandled = filesToHandle.map(file => {
        logger.log(`Handling file ${file}`);
        addTagToScenariosOfFile(file);
        return file;
    });

    console.log(`Successfully handled ${filesHandled.length} feature files.`);
}

function addTagToScenariosOfFile(file) {
    logger.log(`Assigning Test Runners to file [${file}]`);
    const lines = fs.readFileSync(file, "utf-8").split('\n');
    const newLines = lines.map(line => {
        if (line.includes(scope.options.tests) && !line.includes(`${scope.options.runnerAnnotation}${scope.runnerNumber}`)) {
            logger.log(`Adding ${scope.options.runnerAnnotation}${scope.runnerNumber} to line [${line}]`);
            if(!scope.options.dryRun) { //only do this if it is not a dryrun
                line = line + ` ${scope.options.runnerAnnotation}${scope.runnerNumber}`;
            }
            scope.runnerNumber = (scope.runnerNumber++ % scope.options.runnerAmount) + 1;
            if (scope.runnerAmountAssigned < scope.options.runnerAmount) scope.runnerAmountAssigned++;
        }
        return line;
    });

    fs.writeFileSync(file, newLines.join('\n'), err => {
        if (err) throw err;
    });
}