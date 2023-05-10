import path from "path";

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { scanFeatureFiles } = require("./scanner");
const { assignTestRunnerAnnotation } = require("./tagger");
const { cleanFeatureFiles, removeRunnerLogFolder, removeReportFolders } = require("./remover");
const { parseArgumentsIntoOptions } = require("./arguments-parser");
const { generateReport, removeSkippedTests} = require('./allure-handler');
const scope = require("./scope");
const fs = require('fs');

export async function executeCommandXTimes() {
    console.log("Executing the commands");
    //if allure is enabled and the folders should be cleaned first
    if(scope.options.allure && scope.options.cleanAllureReports) {
        removeReportFolders();
    }

    //should runnerlogs be removed?
    if(scope.options.cleanRunnerLogs)
        removeRunnerLogFolder();

    scanFeatureFiles(path.join(process.cwd(),scope.options.featureFolder)); //scan the feature folder for feature files
    cleanFeatureFiles(); //clean the found feature files from previous runner annotations (only works with the default annotation or if the custom annotation is the same as before

    assignTestRunnerAnnotation(); //assign the test runner annotation for this run

    const runnerList = [];
    fs.mkdirSync(path.join(process.cwd(),"runner-logs"));
    for (let i = 1; i <= scope.runnerAmountAssigned; i++) {
        try {
            const command = `npx cypress run --browser ${scope.options.browser} --config-file ${scope.options.configFile} --env allure=${scope.options.allure},allureResultsPath=${scope.options.allureReportFolderName}-${scope.options.runnerAnnotation}-${i},tags="${scope.options.tags} and ${scope.options.runnerAnnotation}-${i}"${scope.options.specFile != null? " --spec "+scope.options.specFile:""} > runner-logs/${scope.options.runnerAnnotation}-${i}.log`;
            console.log(`Spawning console command [${command}]`)
            if( !scope.options.dryRun ) {
                runnerList.push(execAsync(command));
            }
        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }

    Promise.all(runnerList)
        .then((results) => {
            if(scope.options.allure) {
                removeSkippedTests(); //remove the skipped tests from each runner so there is no crazy overload of skipped tests/scenarios
                generateReport(); //generate the report as a sum
            }
        })
        .catch((error) => {
            console.error(`[Error]: ${error}`);
        });
}