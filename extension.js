const vscode = require("vscode");
const { ConfigParser } = require("./src/parser");
const { javascriptProvider } = require("./src/providers/javascript");
const { getConfig } = require("./src/config");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const { file } = getConfig();

  if (!file) {
    return vscode.window.showInformationMessage(
      `Welcome to alias-resolver extension! Define which file you want to use to resolve alias in your user/workspace settings!`
    );
  }

  vscode.workspace.findFiles(file, "**/node_modules/**").then(([{ path }]) => {
    vscode.workspace.openTextDocument(path).then((document) => {
      vscode.window.showInformationMessage(
        `Using ${file} to resolve alias paths`
      );
      const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
      const ctx = {
        __dirname: workspace.uri.path,
        __process: {
          cwd() {
            return vscode.workspace.rootPath;
          },
        },
        path: require("path"),
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
