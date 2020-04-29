// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { Parser } = require("acorn");
const walk = require("acorn-walk");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "alias-resolver" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "alias-resolver.helloWorld",
    function () {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello from alias-resolver!");
    }
  );

  vscode.workspace
    .findFiles("**/webpack.common.js", "**/node_modules/**")
    .then(([{ path }]) => {
      vscode.workspace.openTextDocument(path).then((document) => {
        const text = document.getText();
        const ast = Parser.parse(text);

        walk.simple(ast, {
          Property(node) {
            if (node.key.name === "alias") {
              console.log(node);
            }
          },
        });
      });
    });
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
