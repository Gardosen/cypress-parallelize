import arg from 'arg';
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require("path");
const execAsync = promisify(exec);

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--runner-amount': Number,
            '--tags': String,
            '--spec': String,
            '--cypress-tests-path': String,
            '--allure': Boolean,
            '--config-file': String,
            '--browser': String,
            '-r': '--runner-amount',
            '-a': '--allure',
            '-t': '--tags',
            '-s': '--spec',
            '-c': '--cypress-tests-path',
            '-f': '--config-file',
            '-b': '--browser'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        amount: args['--amount'] || 5, //amount of runners to spawn for the execution
        tags: args['--tags'] || "@regression", //tags that should be used for the matching process to assign the runners
        specFile: args['--spec'] || null, //path to a specific spec feature file
        cypressTestsPath: args['--cypress-tests-path'] || "./cypress/e2e", //path to the root folder in which all feature files are stored
        allure: args['--allure'] || true, //should allure be enabled or disabled
        configFile: args['--config-file'] || null,
        browser: args['--browser'] || "chrome"
    };
}

let FEATURE_FILE_LIST = [];
export async function executeCommandXTimes(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
    console.log(`CWD is: [${process.cwd()}]`);
    //scan the project for feature files
    scanFeatureFiles(process.cwd()+options.cypressTestsPath);
    //prepare the test-project clean the files first from eventual previous incorrectly cleaned up runs and assign a runner to each test scenario that matches the tags definition
    cleanFeatureFiles(options);
    assignTestRunnerAnnotation(options);

    for (let i = 1; i < options.amount+1; i++) {
        try {
            const { stdout } = execAsync(`npx cypress run --browser ${options.browser} --config-file ${options.configFile} --env allure=${options.allure},tags="not @wip and ${options.tags} and @runner-${i}"`);
            //TODO, parse the output to a runner file and not the cli yet
            //TODO: give each runner an own color and a pre fix to show what runner the cli output comes from (tail filter)
        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }
}

function assignTestRunnerAnnotation(options){
    console.log("Test Runner Assignment");
    if(options.specFile != null) {
        //we have to check a specific file
        console.log(`Handling file ${options.specFile}`);
        addTagToScenariosOfFile(options.specFile, options);
    } else {
        //we have to check all files
        //get all spec files from all folders of the cypress automation
        console.log(FEATURE_FILE_LIST.length);
        FEATURE_FILE_LIST.forEach(file => {
            console.log(`Handling file ${file}`);
            addTagToScenariosOfFile(file, options);
        });
    }
}

const RUNNER_ANNOTATION = "@runner-"
let RUNNER_NUMBER = 1;
function addTagToScenariosOfFile(file, options){
    console.log(`Assigning Test Runners to file [${file}]`);
    let lineArray = fs.readFileSync(file, "utf-8").split('\n');
    let fileContent = "";
    lineArray.forEach(line => {
        //check for the exclusion and inclusion tags
        if(line.includes(options.tags) && !line.includes(`${RUNNER_ANNOTATION}${RUNNER_NUMBER}`)) {
            console.log(`Adding ${RUNNER_ANNOTATION}${RUNNER_NUMBER} to line [${line}]`);
            //the line is supposed to contains the tag and does not so yet
            line= line+` ${RUNNER_ANNOTATION}${RUNNER_NUMBER}`;
            RUNNER_NUMBER = (RUNNER_NUMBER++%options.amount)+1;
        }
        fileContent = fileContent.concat(line+"\n");
    });

    fs.writeFileSync(file,fileContent, (err) => {
        // In case of a error throw err.
        if (err) throw err;
    });
}

function cleanFeatureFiles(options){
    if(options.specFile != null) {
        //we have to check a specific file
        removeRunnerTagFromFile(options.specFile);
    } else {
        //we have to check all files
        //get all spec files from all folders of the cypress automation
         FEATURE_FILE_LIST.forEach(file => {
             removeRunnerTagFromFile(file);
         });
    }
}

function removeRunnerTagFromFile(file) {
    const filePath = path.resolve(file);

    try {
        const data = fs.readFileSync(filePath, 'utf8').split('\n');
        let handledData;
        data.forEach(line => {
            let replacedData = line;
            if(line.length > 0 && line.includes(RUNNER_ANNOTATION)) {
                console.log(`Checking line [${line}]\n`);
                replacedData = line.replace(new RegExp(`\s{0,}${RUNNER_ANNOTATION}\d+`, "g"), "");
            }
            if(replacedData !== undefined)
                handledData += replacedData + "\n";
        });
        console.log(`line [${handledData}] to the file from handleData`);
        fs.writeFileSync(filePath, handledData);

        console.log(`Successfully removed all ${RUNNER_ANNOTATION}X annotation in ${filePath}`);
    } catch (err) {
        console.error(err);
    }
}

function scanFeatureFiles(dir){
    console.log(`Reading files from folder ${dir}`);
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            /* Recurse into a subdirectory */
            //console.log(`found folder [${file}] in folder [${dir}]`);
            scanFeatureFiles(file+"/");
        } else {
            /* Is a file, only check files with the extension .feature and ignore any file with a pretension . */
            if(!path.parse(file).base.startsWith(".") && path.parse(file).base.endsWith(".feature")) {
                console.log(`Found file [${path.parse(file).base}] in folder [${path.parse(file).dir}]`);
                FEATURE_FILE_LIST.push(file);
            }
        }
    });
}

