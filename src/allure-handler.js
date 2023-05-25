import path from "path";
const scanner = require("./scanner");
const { remove } = require('./remover');
const scope = require("./scope");
const fs = require('fs');
const logger = require('./logger');
const allure = require('allure-commandline');
const moment = require('moment');


export function generateReport() {
    logger.log("Generating Allure Report");
    const generation = allure(['generate', scope.options.allureRunnerReportFolderName, "-c", "-o", `test-reports/${scope.options.domain}/${scope.options.type}/${moment().format('YYYY-MM-DD--HH-mm-ss')}` ]);
    generation.on('exit', function(exitCode) {
        console.log('Generation is finished with code:', exitCode);
    });
}

export function mergeAllureReport(){
    logger.log(`Merging all runner reports now to a single folder called ${scope.options.allureRunnerReportFolderName}`);
    const folders = scanner.getFolderListByRegExp(new RegExp(`${scope.options.allureRunnerReportFolderName}/${scope.options.runnerAnnotation}\\d`));
    folders.forEach((folder) => {
        try {
            if(!scope.options.dryRun) {
                const allureRunnerReportFolder = path.join(process.cwd(), scope.options.allureRunnerReportFolderName);
                if (!fs.existsSync(allureRunnerReportFolder)) {
                    console.log(`Final Report Folder does not exist, creating it now with the name ${allureRunnerReportFolder}`);
                    fs.mkdirSync(allureRunnerReportFolder);
                }
                copyFiles(folder, path.join(process.cwd(),scope.options.allureRunnerReportFolderName));
            }
            logger.log(`Files in folder ${folder} have been moved to ${scope.options.allureRunnerReportFolderName} and source folder has been deleted.`);
        } catch (err) {
            logger.error(`Could not move files from folder ${folder} to folder ${scope.options.allureRunnerReportFolderName}:`, err);
        }
    });
}

export function removePendingTests() {
    logger.log('Cleaning runner report folders from pending tests');
    const folders = scanner.getFolderListByRegExp(new RegExp(`${scope.options.allureRunnerReportFolderName}/${scope.options.runnerAnnotation}\\d`));

    folders.forEach(folder => {
       const files = fs.readdirSync(folder);
       files.forEach(file => {
           const filePath = path.join(folder,file);
           const content = fs.readFileSync(filePath, {encoding: 'utf8', flag: 'r'});

          if(content.includes('"status":"pending"')) {
              remove(filePath);
           }
       });
    });
}

function copyFiles(sourceFolder, destinationFolder) {
    const files = fs.readdirSync(sourceFolder);

    files.forEach(file => {
        const sourcePath = path.join(sourceFolder, file);
        const destinationPath = path.join(destinationFolder, file);

        try {
            if(!fs.existsSync(sourcePath)){
                logger.log("something is off here!");
            }
            fs.copyFileSync(sourcePath, destinationPath);
            remove(sourcePath);
        } catch(err) {
            console.log(`something went wrong: ${err}`);
        }
    });
    remove(sourceFolder);
}