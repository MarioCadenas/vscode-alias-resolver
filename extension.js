const vscode = require('vscode');
const registerCommands = require('./src/commands');
const registerProviders = require('./src/providers');
const { ConfigParser } = require('./src/parser');
const { getConfig, configureExtensionSettings } = require('./src/config');
const { ACTIONS } = require('./src/constants');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  registerCommands();

  let { file, type, accessPath } = getConfig();

  if (!file) {
    const prompt = await vscode.window.showInformationMessage(
      `Welcome to alias-resolver extension! Do you want to configure the extension now?`,
      ACTIONS.CONFIGURE,
      ACTIONS.CLOSE
    );

    if (!prompt || prompt === ACTIONS.CLOSE) {
      return;
    }

    ({ file, type, accessPath } = await configureExtensionSettings());

    if (!file) {
      return;
    }
  }

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('alias-resolver')) {
      const { file, type, accessPath } = getConfig();

      vscode.workspace.findFiles(file, '**/node_modules/**').then((result) => {
        const path = result[0].path;
        const config = require(path);

        vscode.window.showInformationMessage(
          `Using ${file} to resolve alias paths`
        );

        ConfigParser.createMappingsFromConfig(config, { type, accessPath });
      });
    }
  });

  vscode.workspace.findFiles(file, '**/node_modules/**').then((result) => {
    const path = result[0].path;
    const config = require(path);

    vscode.window.showInformationMessage(
      `Using ${file} to resolve alias paths`
    );

    ConfigParser.createMappingsFromConfig(config, { type, accessPath });
    registerProviders(context);
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
