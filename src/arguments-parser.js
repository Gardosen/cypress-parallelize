import arg from "arg";

export function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--runner-amount': Number,
            '--tags': String,
            '--tests': String,
            '--spec': String,
            '--cypress-tests-path': String,
            '--allure': Boolean,
            '--config-file': String,
            '--browser': String
        },
        {
            permissive: false,
            argv: rawArgs.slice(2),
        }
    );
    return {
        amount: args['--amount'] || 5, //amount of runners to spawn for the execution
        tags: args['--tags'] || "not @wip and @regression", //string that is forwarded to cypress including the ending "and @runner-X"
        tests: args['--tests'] || '@', //annotation which is supposed to be used to identify all tests that should get a runner assigned
        specFile: args['--spec'] || null, //path to a specific spec feature file
        cypressTestsPath: args['--cypress-tests-path'] || "./cypress/e2e", //path to the root folder in which all feature files are stored
        allure: args['--allure'] !== false, //should allure be enabled or disabled
        configFile: args['--config-file'] || null, //string that is forwarded to cypress to identify the config-file to be used for the execution
        browser: args['--browser'] || "chrome" //string that is forwarded to cypress to identify the browser to be used for the execution
    };
}