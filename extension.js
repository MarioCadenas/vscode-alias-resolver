const vscode = require('vscode');
const registerCommands = require('./src/commands');
const registerProviders = require('./src/providers');
const { ConfigParser } = require('./src/parser');
const userConfig = require('./src/user-config');
const { ACTIONS } = require('./src/constants');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  registerCommands(userConfig);

  let { file, type, accessPath } = userConfig.getConfig();

  if (!file) {
    const prompt = await vscode.window.showInformationMessage(
      `Welcome to alias-resolver extension! Do you want to configure the extension now?`,
      ACTIONS.CONFIGURE,
      ACTIONS.CLOSE
    );

    if (!prompt || prompt === ACTIONS.CLOSE) {
      return;
    }

    ({
      file,
      type,
      accessPath,
    } = await userConfig.configureExtensionSettings());

    if (!file) {
      return;
    }
  }

  // TODO: Refactor how this is handle so there's no repeated code
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('alias-resolver')) {
      const { file, type, accessPath } = userConfig.getConfig();

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
