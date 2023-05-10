

export async function showHelp(){
    return   `+-----------------------------------------------+
|                Help Description               |
+-----------------------------------------------+

--runner-amount:           Amount of Runners to spawn (Number)
--runner-annotation:       annotation that will be assigned to the scenarios (String)
--tags:                    tags to look for to which a runner will be assigned to (E.g. @smoke, @regression) (String)
--tests:                   tests to execute with each runner (E.g. "@smoke and not @wip") (String)
                            - the final tests variable passed to the runner is a concatenation
                              between the given variable and the string literal <runner-annotation>-<number>
--spec:                    spec feature file to test (String)
--feature-folder:          feature folder to  (String)
--config-file:             config file to use for the cypress execution (String)
--browser:                 browser to use for the cypress execution (String)
--dry-run:                 should this execution be a dryrun? (Boolean)
--allure:                  enables allure to create a report for the test runners (Boolean)
--clean-allure-reports:    clear allure reports from all skipped tests to avoid weird allure reportings (Boolean)
--allure-report-folder-name: custom naming for the allure report folder name (String)
--clean-runner-logs:       delete the runner log files before execution (Boolean)
--help:                    show the help screen (Boolean)

+-----------------------------------------------+
`;
}