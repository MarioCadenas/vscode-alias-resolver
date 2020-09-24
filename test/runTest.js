const path = require('path');
const pkg = require('../package.json');
const { runTests } = require('vscode-test');

const vscodeVersion = pkg.engines.vscode.replace(/[^0-9.]/g, '');

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../');
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    await runTests({
      version: vscodeVersion,
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ['--disable-extensions'],
    });
  } catch (err) {
    console.error('Failed to run tests');
    process.exit(1);
  }
}

main();
