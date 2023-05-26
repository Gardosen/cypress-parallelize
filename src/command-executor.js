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

export function executeCommandXTimes() {
    for (let i = 1; i <= scope.runnerAmountAssigned; i++) {
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
                }).catch((error)=>{
                    logger.error(`Iteration ${i + 1} - Error: ${error.message}`);
                });
                runnerList.push(promise);
            }
    }
    return runnerList;
}

//WIP, not really well working right now!
function handleRunnerLogs(result, promise) {
    if (scope.options.runnerLog) {
        try {
            if (!fs.existsSync(path.join(process.cwd(), scope.options.runnerLogFolderName)))
                fs.mkdirSync(path.join(process.cwd(), scope.options.runnerLogFolderName));
            const errorLogStream = fs.createWriteStream(`${scope.options.runnerLogFolderName}/${promise.runnerInformation.runnerIdentifier}-stderr.log`, {flags: 'a'});
            const infoLogStream = fs.createWriteStream(`${scope.options.runnerLogFolderName}/${promise.runnerInformation.runnerIdentifier}-stdout.log`, {flags: 'a'});
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
