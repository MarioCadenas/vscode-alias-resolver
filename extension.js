// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { Parser } = require("acorn");
const walk = require("acorn-walk");
const { statSync, readdir } = require("fs");
const { join, normalize, dirname, sep } = require("path");
const { EXPRESSION_TYPES } = require("./src/types");
const { getLiteralValue } = require("./src/literal");
const { promisify } = require("util");
const { alias } = require("./src/alias/alias-map");
const { isAliasPath } = require("./src/utils/path");
const { javascriptProvider } = require("./src/providers/javascript");
const readdirAsync = promisify(readdir);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

class FileInfo {
  constructor(path, file) {
    this.file = file;
    this.isFile = statSync(join(path, file)).isFile();
  }
}

function getPathOfFolderToLookupFiles(fileName, text, rootPath, mappings) {
  const normalizedText = normalize(text || "");

  const isPathAbsolute = normalizedText.startsWith(sep);

  let rootFolder = dirname(fileName);
  let pathEntered = normalizedText;

  // Search a mapping for the current text. First mapping is used where text starts with mapping
  const mapping =
    mappings &&
    mappings.reduce((prev, curr) => {
      return prev || (normalizedText.startsWith(curr.key) && curr);
    }, undefined);

  if (mapping) {
    rootFolder = mapping.value;
    pathEntered = normalizedText.substring(
      mapping.key.length,
      normalizedText.length
    );
  }

  if (isPathAbsolute) {
    rootFolder = rootPath || "";
  }

  return join(rootFolder, pathEntered);
}

async function getChildrenOfPath(path) {
  try {
    const files = await readdirAsync(path);
    return files.map((f) => new FileInfo(path, f));
  } catch (error) {
    return [];
  }
}

function createPathCompletionItem(fileInfo, config, context) {
  return fileInfo.isFile
    ? createFileItem(fileInfo, config, context)
    : createFolderItem(fileInfo, config.autoSlash, context.importRange);
}

function createFolderItem(fileInfo, autoSlash, importRange) {
  var newText = autoSlash ? `${fileInfo.file}/` : `${fileInfo.file}`;

  return {
    label: fileInfo.file,
    kind: vscode.CompletionItemKind.Folder,
    textEdit: new vscode.TextEdit(importRange, newText),
    sortText: `a_${fileInfo.file}`,
  };
}

function createFileItem(fileInfo, config, context) {
  const textEdit = createCompletionItemTextEdit(fileInfo, config, context);

  return {
    label: fileInfo.file,
    kind: vscode.CompletionItemKind.File,
    sortText: `b_${fileInfo.file}`,
    textEdit,
  };
}

function createCompletionItemTextEdit(fileInfo, config, context) {
  if (config.withExtension || !context.isImport) {
    return undefined;
  }

  const fragments = fileInfo.file.split(".");
  const extension = fragments[fragments.length - 1];

  if (extension !== context.documentExtension) {
    return undefined;
  }

  let index = fileInfo.file.lastIndexOf(".");
  const newText =
    index !== -1 ? fileInfo.file.substring(0, index) : fileInfo.file;
  return new vscode.TextEdit(context.importRange, newText);
}

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
              node.value.properties.forEach((prop) => {
                const key = prop.key.value;
                const value = prop.value;

                walk.simple(value, {
                  CallExpression(n) {},
                });

                const v =
                  value.type === EXPRESSION_TYPES.LITERAL
                    ? getLiteralValue(value)
                    : value;
                alias.set(key, v);
              });

              for (let [key, value] of alias) {
              }
            }
          },
        });

        vscode.languages.registerHoverProvider("javascript", {
          provideHover(document, position, token) {
            const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
            const hoveredLineText = document.getText(
              document.lineAt(position).range
            );

            return new vscode.Hover(hoveredLineText);
          },
        });

        const {
          provideDocumentLinks,
          provideCompletionItems,
          provideDefinition,
        } = javascriptProvider.provider;

        vscode.languages.registerCompletionItemProvider(
          javascriptProvider.selector,
          { provideCompletionItems },
          ...(javascriptProvider.triggerCharacters || [])
        );

        vscode.languages.registerDocumentLinkProvider(
          javascriptProvider.selector,
          { provideDocumentLinks }
        );

        vscode.languages.registerDefinitionProvider(
          javascriptProvider.selector,
          { provideDefinition }
        );
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
