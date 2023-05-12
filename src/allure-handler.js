import {exec} from "child_process";
const scope = require("./scope");
const fs = require('fs');
const logger = require('./logger');

export function generateReport(){
    logger.log("Generating Allure Report");
    exec(`allure generate ${scope.options.allureRunnerReportFolderName}${scope.options.allureMergeRunnerReports?`${scope.options.runnerAnnotation}* `:' '}-c -o "test-reports/${process.env.DOMAIN}/${process.env.TYPE}/$(date +"%Y-%m-%d--%H-%M-%S")" `);
}

export function mergeAllureReport(){
    logger.log(`Merging all runner reports now to a single folder called ${scope.options.allureRunnerReportFolderName}`);
    //TODO implement the scanner which returns all folders belongung to a runner report and move the files over to the single folder
}

export function removePendingTests() {
    logger.log('Cleaning runner report folders from pending tests');
    exec(`grep -rl '"status":"pending"' ${process.cwd()}/${scope.options.allureRunnerReportFolderName}${scope.options.runnerAnnotation}* | xargs rm -rf`);
}