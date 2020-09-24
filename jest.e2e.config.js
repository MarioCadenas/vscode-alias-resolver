const path = require('path');

module.exports = {
  testMatch: ['<rootDir>/test/**/*.test.js'],
  verbose: true,
  testEnvironment: './test/setup/vscode-environment.js',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    vscode: path.join(__dirname, 'test', 'setup', 'vscode.js'),
  },
};
