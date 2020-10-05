const vscode = require('vscode');
const registerCommands = require('./src/commands');
const registerProviders = require('./src/providers');
const { ConfigParser } = require('./src/parser');
const { getConfig, configureFile } = require('./src/config');
const { ACTIONS } = require('./src/constants');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  registerCommands();

  const { file } = getConfig();
  let fileName;

  if (!file) {
    const prompt = await vscode.window.showInformationMessage(
      `Welcome to alias-resolver extension! Do you want to configure the extension now?`,
      ACTIONS.CONFIGURE,
      ACTIONS.CLOSE
    );

    if (!prompt || prompt === ACTIONS.CLOSE) {
      return;
    }

    fileName = await configureFile();

    if (!fileName) {
      return;
    }
  }

  vscode.workspace
    .findFiles(fileName || file, '**/node_modules/**')
    .then(([{ path }]) => {
      vscode.workspace.openTextDocument(path).then((document) => {
        vscode.window.showInformationMessage(
          `Using ${fileName || file} to resolve alias paths`
        );
        const text = document.getText();

        ConfigParser.createMappingsFromConfig(text);
        registerProviders(context);
      });
    });
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
