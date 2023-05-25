import fs from "fs";
import path from "path";

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { cleanFeatureFiles } = require("./remover");
const { generateReport, removePendingTests, mergeAllureReport} = require('./allure-handler');
const scope = require("./scope");
const logger = require('./logger');


const runnerList = [];

export async function executeCommandXTimes() {
    for (let i = 1; i <= scope.runnerAmountAssigned; i++) {
        try {
            const command = `npx cypress run --browser ${scope.options.browser} --config-file ${scope.options.configFile} --env ${scope.options.allure? `allure=${scope.options.allure},allureClearSkippedTests=true,allureResultsPath=${scope.options.allureRunnerReportFolderName}/${scope.options.runnerAnnotation}${i},`:''}tags="${scope.options.tags!==null? `${scope.options.tags} and `: '' }${scope.options.runnerAnnotation}${i}"${scope.options.spec != null? ` --spec ${scope.options.spec}`:""}`;
            logger.log(`Spawning console command [${command}]`)
            if( !scope.options.dryRun ) {
                const promise = execAsync(command);
                promise.runnerInformation = {
                    runnerIdentifier: `${scope.options.runnerAnnotation}${i}`,
                    command: command
                }
                promise.then((result) => {
                   handleRunnerLogs(result, promise);
                });
                runnerList.push(promise);
            }
        } catch (error) {
            logger.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }

    if(scope.options.dryRun) {
        logger.log("None of the commands have been executed");
    } else {
        //as this was a dry run, we do not have any promise to resolve
        Promise.all(runnerList.map(p => p.catch(e => e)))
            .then((results) => {
                if (scope.options.allure) {
                    if(scope.options.allureRemovePendingTests)
                        removePendingTests(); //remove the skipped tests from each runner so there is no crazy overload of skipped tests/scenarios
                    if(scope.options.allureMergeRunnerReports)
                        mergeAllureReport();
                    if(scope.options.allureGenerateReport) {
                        generateReport();
                    } //generate the report as a sum
                }
                cleanFeatureFiles(); //clean the found feature files from previous runner annotations (only works with the default annotation or if the custom annotation is the same as before
            });
    }
}

//WIP, not really well working right now!
function handleRunnerLogs(result, promise) {
    if (scope.options.runnerLog) {
        try {
            if (!fs.existsSync(path.join(process.cwd(), scope.options.runnerLogFolderName)))
                fs.mkdirSync(path.join(process.cwd(), scope.options.runnerLogFolderName));
            const errorLogStream = fs.createWriteStream(`${scope.options.runnerLogFolderName}/${promise.runnerInformation.runnerIdentifier}-stdout.log`, {flags: 'a'});
            const infoLogStream = fs.createWriteStream(`${scope.options.runnerLogFolderName}/${promise.runnerInformation.runnerIdentifier}-stderr.log`, {flags: 'a'});
            try {
                logger.log(`The Runner ${promise.runnerInformation.runnerIdentifier} is done!`);
                errorLogStream.write(result.stderr);
                infoLogStream.write(result.stdout);
            } catch (error) {
                logger.error(error);
            } finally {
                errorLogStream.close();
                infoLogStream.close();
            }
        } catch (error) {
            logger.error(error);
        }
    }
}
