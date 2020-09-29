const path = require('path');
const { runCLI } = require('@jest/core');

const VSCodeJestRunner = {
  run(testsRoot, reportTestResults) {
    const projectRootPath = path.join(__dirname, '../..');
    const config = path.join(projectRootPath, 'jest.e2e.config.js');

    return runCLI({ config }, [projectRootPath])
      .then((jestCliCallResult) => {
        jestCliCallResult.results.testResults.forEach((testResult) => {
          testResult.testResults
            .filter((assertionResult) => assertionResult.status === 'passed')
            .forEach(({ ancestorTitles, title, status }) => {
              console.info(`  ● ${ancestorTitles} › ${title} (${status})`);
            });
        });

        jestCliCallResult.results.testResults.forEach((testResult) => {
          if (testResult.failureMessage) {
            console.error(testResult.failureMessage);
          }
        });

        reportTestResults(undefined, jestCliCallResult.results.numFailedTests);
      })
      .catch((errorCaughtByJestRunner) => {
        reportTestResults(errorCaughtByJestRunner, 0);
      });
  },
};

module.exports = VSCodeJestRunner;
