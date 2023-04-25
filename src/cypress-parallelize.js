import arg from 'arg';
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--amount': Number,
            '--tags': String,
            '--spec': String,
            '-a': '--amount',
            '-t': '--tags',
            '-s': '--spec',
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        amount: args['--amount'] || 5,
        tags: args['--tags'] || "@regression",
        specFiles: args['--spec'] || null
    };
}

export async function executeCommandXTimes(args) {
    let options = parseArgumentsIntoOptions(args);
    console.log(options);
    for (let i = 0; i < options.amount; i++) {
        //handle parameters for the cypress execution
        //TODO
        let parameters;
        try {
            const { stdout } = execAsync("npx cypress run " + parameters);
            //TODO, parse the output to a runner file and not the cli yet
            //TODO: give each runner an own color and a pre fix to show what runner the cli output comes from (tail filter)
        } catch (error) {
            console.error(`Iteration ${i + 1} - Error: ${error.message}`);
        }
    }
}