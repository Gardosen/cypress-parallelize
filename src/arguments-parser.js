import arg from "arg";

const scope = require("./scope");

export const parameterMap = {
    runnerAmount: {
        label: "--runner-amount",
        type: Number,
        description: "Amount of Runners to spawn (Number)",
        examples: [],
        requires: [],
        default: 5
    },
    runnerAnnotation: {
        label: "--runner-annotation",
        type: String,
        description: "annotation which is used for the runner assignment and execution",
        examples: ["@runner-", "@executor"],
        requires: [],
        default: "@runner-"
    },
    tags: {
        label: "--tags",
        type: String,
        description: "tags to look for to which will be forwarded to cypress for the execution",
        examples: ["@smoke", "@regression"],
        requires: [],
        default: "not @wip and @regression"
    },
    tests: {
        label: "--tests",
        type: String,
        description: "annotation which is supposed to be used to identify all tests that should get a runner assigned",
        examples: ["@regression", "@smoke", "@JIRA-4457", "@1.5.4-R2"],
        requires: [],
        default: "@"
    },
    spec: {
        label: "--spec",
        type: String,
        description: "path to a specific spec feature file",
        examples: ["cypress/e2e/google/search.feature"],
        requires: [],
        default: null
    },
    featureFolder: {
        label: "--feature-folder",
        type: String,
        description: "path to the root folder in which all feature files are stored",
        examples: ["cypress/e2e/google/"],
        requires: [],
        default: "cypress/e2e"
    },
    configFile: {
        label: "--config-file",
        type: String,
        description: "string that is forwarded to cypress to identify the config-file to be used for the execution",
        examples: ["cypress/config/prod.config.js"],
        requires: [],
        default: "cypress.config.js"
    },
    browser: {
        label: "--browser",
        type: String,
        description: "string that is forwarded to cypress to identify the browser to be used for the execution",
        examples: ["chrome", "electron"],
        requires: [],
        default: "chrome"
    },
    dryRun: {
        label: "--dry-run",
        type: Boolean,
        description: "boolean flag if the execution should only be simulated",
        examples: [],
        requires: [],
        default: false
    },
    allure: {
        label: "--allure",
        type: Boolean,
        description: "should allure be enabled or disabled",
        examples: [],
        requires: [],
        default: false
    },
    cleanAllureReports: {
        label: "--clean-allure-reports",
        type: Boolean,
        description: "should the report folders be removed before an execution?",
        examples: [],
        requires: ["--allure"],
        default: false
    },
    allureReportFolderName: {
        label: "--allure-report-folder-name",
        type: String,
        description: "name of the reporting folder for the allure reports per runner",
        examples: ["allure-report", "report", "runner-report"],
        requires: ["--allure"],
        default: "allure-report-"
    },
    runnerLog: {
        label: "--runner-log",
        type: Boolean,
        description: "should the output of each runner be logged to a file",
        examples: [],
        requires: [],
        default: false
    },
    runnerLogFolderName: {
        label: "--runner-log-folder-name",
        type: String,
        description: "custom name for the folder where the runner",
        examples: ["logs", "execution-logs"],
        requires: ["--runner-log"],
        default: "runner-logs"
    },
    cleanRunnerLogs: {
        label: "--clean-runner-logs",
        type: Boolean,
        description: "should the runner logs be deleted before the execution?",
        examples: [],
        requires: ["--runner-log"],
        default: false
    },
    help: {
        label: "--help",
        type:Boolean,
        description: "should the help menu be shown?",
        examples: [],
        requires: [],
        default: false
    },
    version: {
        label: "--version",
        type: Boolean,
        description: "show the version of cypress parallelize",
        examples: [],
        requires: [],
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