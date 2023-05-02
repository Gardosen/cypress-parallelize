import fs from "fs";
import path from "path";

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { scanFeatureFiles } = require("./scanner");
const { assignTestRunnerAnnotation } = require("./tagger");
const { cleanFeatureFiles } = require("./remover");
const { parseArgumentsIntoOptions } = require("./arguments-parser");
const scope = require("./scope");

export async function executeCommandXTimes(args) {
    parseArgumentsIntoOptions(args); //process the arguments passed to the execution
    console.log(scope.options);
    scanFeatureFiles(path.join(process.cwd(),scope.options.featureFolder)); //scan the feature folder for feature files
    cleanFeatureFiles(); //clean the found feature files from previous runner annotations (only works with the default annotation or if the custom annotation is the same as before
    assignTestRunnerAnnotation();

    if( !scope.options.dryRun ) {
        for (let i = 1; i <= scope.runnerAmmountAssigned; i++) {
            try {
                const { stdout } = execAsync(`npx cypress run --browser ${scope.options.browser} --config-file ${scope.options.configFile} --env allure=${scope.options.allure},tags="${scope.options.tags} and ${scope.options.runnerAnnotation}${i}"${scope.options.specFile != null? " --spec "+scope.options.specFile:""}`);
                const logStream = fs.createWriteStream(`logs/log-${i}.txt`, { flags: 'a' });
                stdout.pipe(logStream);
            } catch (error) {
                console.error(`Iteration ${i + 1} - Error: ${error.message}`);
            }
        }
    }
}