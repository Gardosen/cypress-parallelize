
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { cleanFeatureFiles } = require("./remover");
const { generateReport, removePendingTests, mergeAllureReport} = require('./allure-handler');
const scope = require("./scope");
const logger = require('./logger');

export async function executeCommandXTimes() {
    const runnerList = [];
    for (let i = 1; i <= scope.runnerAmountAssigned; i++) {
        try {
            const command = `npx cypress run --browser ${scope.options.browser} --config-file ${scope.options.configFile} --env allure=${scope.options.allure},allureClearSkippedTests=true,allureResultsPath=${scope.options.allureRunnerReportFolderName}${scope.options.runnerAnnotation}${i},tags="${scope.options.tags!==null? `${scope.options.tags} and `: '' }${scope.options.runnerAnnotation}${i}"${scope.options.spec != null? ` --spec ${scope.options.spec}`:""}`;
            logger.log(`Spawning console command [${command}]`)
            if( !scope.options.dryRun ) {
                runnerList.push(execAsync(command))
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