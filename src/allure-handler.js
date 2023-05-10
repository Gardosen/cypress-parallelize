import {exec} from "child_process";
const scope = require("./scope");
const fs = require('fs');
export function generateReport(){
    console.log("Generating Allure Report");
    exec(`allure generate ${scope.options.allureReportFolderName}-${scope.options.runnerAnnotation}-*  -c -o "test-reports/${process.env.DOMAIN}/${process.env.TYPE}/$(date +"%Y-%m-%d--%H-%M-%S")" `);
}

export function removeSkippedTests() {
    //TODO we should check if we can somehow only remove the skipped ones which have another runner assigned and not all
    console.log('Cleaning runner report folders from skipped tests');
    exec(`grep -rl '"status":"skipped"' ${process.cwd()}/${scope.options.allureReportFolderName}-${scope.options.runnerAnnotation}-* | xargs rm -rf`);
}