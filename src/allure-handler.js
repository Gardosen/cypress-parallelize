import {exec} from "child_process";
const scope = require("./scope");
const fs = require('fs');
const logger = require('./logger');

export function generateReport(){
    logger.log("Generating Allure Report");
    exec(`allure generate ${scope.options.allureReportFolderName}${scope.options.runnerAnnotation}*  -c -o "test-reports/${process.env.DOMAIN}/${process.env.TYPE}/$(date +"%Y-%m-%d--%H-%M-%S")" `);
}

export function removePendingTests() {
    logger.log('Cleaning runner report folders from pending tests');
    exec(`grep -rl '"status":"pending"' ${process.cwd()}/${scope.options.allureReportFolderName}${scope.options.runnerAnnotation}* | xargs rm -rf`);
}