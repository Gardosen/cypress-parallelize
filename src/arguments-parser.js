import arg from "arg";

const scope = require("./scope");

export const parameterMap = {
    runnerAmount: {
        label: "--runner-amount",
        type: Number,
        description: "Amount of Runners to spawn (Number)",
        examples: [],
        default: 5
    },
    runnerAnnotation: {
        label: "--runner-annotation",
        type: String,
        description: "annotation which is used for the runner assignment and execution",
        examples: ["@runner-", "@executor"],
        default: "@runner-"
    },
    tags: {
        label: "--tags",
        type: String,
        description: "tags to look for to which a runner will be assigned to",
        examples: ["@smoke", "@regression"],
        default: "not @wip and @regression"
    },
    tests: {
        label: "--tests",
        type: String,
        description: "annotation which is supposed to be used to identify all tests that should get a runner assigned",
        examples: ["@regression", "@smoke", "@JIRA-4457", "@1.5.4-R2"],
        default: "@"
    },
    specs: {
        label: "--spec",
        type: String,
        description: "path to a specific spec feature file",
        examples: ["cypress/e2e/google/search.feature"],
        default: null
    },
    featureFolder: {
        label: "--feature-folder",
        type: String,
        description: "path to the root folder in which all feature files are stored",
        examples: ["cypress/e2e/google/"],
        default: "cypress/e2e"
    },
    configFile: {
        label: "--config-file",
        type: String,
        description: "string that is forwarded to cypress to identify the config-file to be used for the execution",
        examples: ["cypress/config/prod.config.js"],
        default: "cypress.config.js"
    },
    browser: {
        label: "--browser",
        type: String,
        description: "string that is forwarded to cypress to identify the browser to be used for the execution",
        examples: ["chrome", "electron"],
        default: "chrome"
    },
    dryRun: {
        label: "--dry-run",
        type: Boolean,
        description: "boolean flag if the execution should only be simulated",
        examples: [],
        default: false
    },
    allure: {
        label: "--allure",
        type: Boolean,
        description: "should allure be enabled or disabled",
        examples: [],
        default: false
    },
    cleanAllureReports: {
        label: "--clean-allure-reports",
        type: Boolean,
        description: "should the report folders be removed before an execution?",
        examples: [],
        default: false
    },
    allureReportFolderName: {
        label: "--allure-report-folder-name",
        type: String,
        description: "name of the reporting folder for the allure reports per runner",
        examples: ["allure-report", "report", "runner-report"],
        default: "allure-report"
    },
    cleanRunnerLogs: {
        label: "--clean-runner-logs",
        type: Boolean,
        description: "should the runner logs be deleted before the execution?",
        examples: [],
        default: false
    },
    help: {
        label: "--help",
        type:Boolean,
        description: "should the help menu be shown?",
        examples: [],
        default: false
    },
    version: {
        label: "--version",
        type: Boolean,
        description: "show the version of cypress parallelize",
        examples: [],
        default: false
    }
}

export async function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        createOptions(),
        {
            permissive: false,
            argv: rawArgs.slice(2),
        }
    );
    scope.options = createScopeOptions(args);
}

function createOptions() {
    const optionsObject = {};
    Object.values(parameterMap).forEach((argument) => {
        optionsObject[argument.label] = argument.type;
    });
    return optionsObject;
}

function createScopeOptions(args) {
    const scopeOptionsMap = {};

    Object.keys(parameterMap).forEach((key) => {
        scopeOptionsMap[key] = args[parameterMap[key].label] || parameterMap[key].default;
    });

    return scopeOptionsMap;
}