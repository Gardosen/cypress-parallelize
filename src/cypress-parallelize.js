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

    for (let i = 1; i <= scope.runnerAmountAssigned; i++) {
        try {
            const command = `npx cypress run --browser ${scope.options.browser} --config-file ${scope.options.configFile} --env allure=${scope.options.allure},allureResultsPath=allure-report-${scope.options.runnerAnnotation}${i},tags="${scope.options.tags} and ${scope.options.runnerAnnotation}${i}"${scope.options.specFile != null? " --spec "+scope.options.specFile:""}`;
            console.log(`Spawning console command [${command}]`)
            if( !scope.options.dryRun ) {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`[Error][${i}]: ${error}`);
                        return;
                    }
                    console.log(`[Info][${i}]: ${stdout}`);
                });
                //const {stdout} = execAsync(command);
                //TODO Think about printout to log files
            }

        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }

}