# Cypress Parallelize

Cypress Parallelize is a npm package for a [Cypress](https://www.cypress.io/) project that allows you to split your tests across multiple runners, allowing for faster test execution times.

## Features

- Parallelize your Cypress tests across multiple runners
- Automatically split your tests into balanced groups
- Specify which tests to run by annotations
- Customize the number of runners
- Compatible with popular CI providers like CircleCI, TravisCI, and Jenkins (not tested yet)

## Getting Started

1. Install Cypress Parallelize in your cypress project via the terminal:

```
npm install cypress-parallelize --save-dev
```

## Execution and Parameter

In order to execute a cypress execution with the support of cypress-parallelize you can use the following command and parameters

```bash
cypress-parallelize [options]
```

### Options

- `--runner-amount=<Number>`: number of tests to split into each runner.
- `--runner-annotation=<String>,`: custom runner annotation how it should be used for the automation. (E.g. @custom-runner)
- `--browser=<String>`: The browser to run tests in.
- `--config-file=<String>`: The path to your Cypress config file.
- `--spec=<String>`: path to the feature file to be handled by the runner.
- `--feature-folder=<String>`: The path to the feature files of the cypress test project. 
- `--allure`: Enable Allure report generation.
- `--clean-allure-reports`: should the allure runner reports be deleted before execution?
- `--allure-runner-report-folder-name=<String>`: custom naming for the allure reporting folders
- `--allure-test-result-folder-name=<String>`: custom naming for the allure test result folder
- `--allure-merge-runner-reports`: should the allure report folders of the runners be merged to a single folder
- `--allure-remove-pending-tests`: should the test files of scenarios set as pending be removed
- `--allure-remove-pending-tests`: should a runner log file be created per runner? (WIP: not working correctly yet)
- `--runner-log-folder-name=<String>`: Name of the log folders
- `--clean-runner-logs`: should the runner logs be cleared from information from previous runs before execution?
- `--clean-runner-logs`: should the runner log files be cleared before execution?
- `--tags=<String>`: String to forward to the cypress execution for the tags environment variable
- `--tests=<String>`: String to scan the tests in the scenario feature files for, to identify which test should be assigned to a runner
- `--dry-run`: Boolean to define if the cypress-parallelize execution should be a dry run
- `--help`: show the help info about all existing parameters
- `--version`: show the current version of cypress parallelize
- `--domain=<String>`: defines the environment or domain to run the tests against (used by the allure report generation)
- `--type=<String>`: defines the test type for the tests (used by the allure report generation)


## Contributing

I welcome contributions! If you want to help me improve this project further and add new functionality. contact me.

## License

Cypress Parallelize is [GPL-2.0 license](LICENSE).