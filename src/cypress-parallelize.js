import arg from 'arg';
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require("path");


const execAsync = promisify(exec);

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--amount': Number,
            '--tags': String,
            '--spec': String,
            '--cypress-tests-path': String,
            '-a': '--amount',
            '-t': '--tags',
            '-s': '--spec',
            '-ctp': '--cypress-tests-path'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        amount: args['--amount'] || 5,
        tags: args['--tags'] || "@regression",
        specFile: args['--spec'] || null,
        cypressTestsPath: args['--cypress-tests-path'] || null
    };
}

export async function executeCommandXTimes(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
    //prepare the test-project and assign a runner to each test scenario that matches the tags definition
    removeRunnerTagFromFile(options)
    assignTestRunnerAnnotation(options)

    for (let i = 1; i < options.amount+1; i++) {
        //handle parameters for the cypress execution
        //TODO
        let parameters;
        try {
            const { stdout } = execAsync(`npx cypress run --env allure=true,tags="not @wip and ${options.tags} and @runner-${i} --reporter nyan"`);
            //TODO, parse the output to a runner file and not the cli yet
            //TODO: give each runner an own color and a pre fix to show what runner the cli output comes from (tail filter)
        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }

    //cleanup from runner annotations
    cleanFeatureFiles(options.specFile);
}

function assignTestRunnerAnnotation(options){
    let runnerCount = 1;

    if(options.specFile != null) {
        //we have to check a specific file
        addTagToScenariosOfFile(options.specFile, options, runnerCount);
    } else {
        //we have to check all files
        //get all spec files from all folders of the cypress automation
        //TODO
    }
}

function addTagToScenariosOfFile(file, options, runner){
    let lineArray = fs.readFileSync(file, "utf-8").split('\n');
    let fileContent = "";
    lineArray.forEach(line => {
        //check for the exclusion and inclusion tags
        if(line.includes(options.tags) && !line.includes(`@runner-${runner}`)) {
            console.log(`adding @runner-${runner} to line [${line}]`);
            //the line is supposed to contains the tag and does not so yet
            line= line+` @runner-${runner}`;
            runner = (runner++%options.amount)+1;
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
        //TODO iterate over all existing feature files and clean them from the runner calls
    }
}

function removeRunnerTagFromFile(file) {
    const filePath = path.resolve(file);

    try {
        const data = fs.readFileSync(filePath, 'utf8');

        const replacedData = data.replace(/\s?@runner-[0-9]*/g, '');

        fs.writeFileSync(filePath, replacedData);

        console.log(`Successfully replaced @regression with @regression @runner-1 in ${filePath}`);
    } catch (err) {
        console.error(err);
    }
}
