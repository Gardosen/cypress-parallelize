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

    logger.log(`Successfully handled ${filesHandled.length} feature files.`);
    for (let runner in scope.testsPerRunner) {
        logger.log(`Tests on ${runner} : ${scope.testsPerRunner[runner]} Test${scope.testsPerRunner[runner]>1?'s':''}`);
    };
}

function addTagToScenariosOfFile(file) {
    logger.log(`Assigning Test Runners to file [${file}]`);
    const lines = fs.readFileSync(file, "utf-8").split('\n');
    const newLines = lines.map(line => {
        if (line.includes(scope.options.testsIncluded) && doesNotHaveExcludes(line) && !line.includes(`${scope.options.runnerAnnotation}${scope.runnerNumber}`)) {
            logger.log(`Adding ${scope.options.runnerAnnotation}${scope.runnerNumber} to line [${line}]`);
            const runnerAnnotation = `${scope.options.runnerAnnotation}${scope.runnerNumber}`;
            if(!scope.options.dryRun) { //only do this if it is not a dryrun
                line = line + " " + runnerAnnotation;
            }
            scope.testsPerRunner[runnerAnnotation] = scope.testsPerRunner[runnerAnnotation] === undefined? 1 : scope.testsPerRunner[runnerAnnotation]+1;
            scope.runnerNumber = (scope.runnerNumber++ % scope.options.runnerAmount) + 1;
            if (scope.runnerAmountAssigned < scope.options.runnerAmount) scope.runnerAmountAssigned++;
        }
        return line;
    });

    fs.writeFileSync(file, newLines.join('\n'), err => {
        if (err) throw err;
    });
}

function doesNotHaveExcludes(line){
    const excludesArray = scope.options.testsExcluded.split(",");
    let noExcludesPresent = true;
    excludesArray.forEach(exclude => {
       if(line.includes(exclude)){
           noExcludesPresent = false;
       }
    });
    return noExcludesPresent;
}