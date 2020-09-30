const vscode = require('vscode');
const path = require('path');
const { ConfigParser } = require('./src/parser');
const { javascriptProvider } = require('./src/providers/javascript');
const { getConfig, updateConfig } = require('./src/config');
const { ACTIONS } = require('./src/constants');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
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

    const result = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
    });

    if (!result) {
      return;
    }

    const [selectedFile] = result;
    const { path: selectedFilePath } = selectedFile;

    fileName = path.basename(selectedFilePath);

    await updateConfig(fileName);
  }

  vscode.workspace
    .findFiles(fileName || file, '**/node_modules/**')
    .then(([{ path }]) => {
      vscode.workspace.openTextDocument(path).then((document) => {
        vscode.window.showInformationMessage(
          `Using ${fileName || file} to resolve alias paths`
        );
        const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
        const ctx = {
          __dirname: workspace.uri.path,
          __process: {
            cwd() {
              return vscode.workspace.rootPath;
            },
          },
          path: require('path'),
        };
        const text = document.getText();

        ConfigParser.createMappingsFromConfig(text, ctx);

        const {
          provideCompletionItems,
          provideDefinition,
        } = javascriptProvider.providers;

        const completionItemDisposable = vscode.languages.registerCompletionItemProvider(
          javascriptProvider.selector,
          { provideCompletionItems },
          ...(javascriptProvider.triggerCharacters || [])
        );

        const definitionDisposable = vscode.languages.registerDefinitionProvider(
          javascriptProvider.selector,
          { provideDefinition }
        );

        context.subscriptions.push(
          completionItemDisposable,
          definitionDisposable
        );
      });
    });
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
