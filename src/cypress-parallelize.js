const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const { scanFeatureFiles } = require("./scanner");
const { assignTestRunnerAnnotation } = require("./tagger");
const { cleanFeatureFiles } = require("./remover");
const { parseArgumentsIntoOptions } = require("./arguments-parser");

export async function executeCommandXTimes(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(`Options:\n${options}`);
    console.log(`CWD is: [${process.cwd()}]`);
    //scan the project for feature files
    scanFeatureFiles(process.cwd()+options.cypressTestsPath);
    //prepare the test-project clean the files first from eventual previous incorrectly cleaned up runs and assign a runner to each test scenario that matches the tags definition
    cleanFeatureFiles(options);
    assignTestRunnerAnnotation(options);

    for (let i = 1; i < options.amount+1; i++) {
        try {
            const { stdout } = execAsync(`npx cypress run --browser ${options.browser} --config-file ${options.configFile} --env allure=${options.allure},tags="${options.tags} and @runner-${i}"`);
            //TODO, parse the output to a runner file and not the cli yet
            //TODO: give each runner an own color and a pre fix to show what runner the cli output comes from (tail filter)
        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }
}