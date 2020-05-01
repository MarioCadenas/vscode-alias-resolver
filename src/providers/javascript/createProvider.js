const vscode = require("vscode");
const path = require("path");
const { alias } = require("../../alias/alias-map");
const { isAliasPath } = require("../../utils/path");

function getFromString(textFullLine, position) {
  const textToPosition = textFullLine.substring(0, position);
  const quoatationPosition = Math.max(
    textToPosition.lastIndexOf('"'),
    textToPosition.lastIndexOf("'"),
    textToPosition.lastIndexOf("`")
  );
  return quoatationPosition !== -1
    ? textToPosition.substring(quoatationPosition + 1, textToPosition.length)
    : undefined;
}

const triggerCharacters = Array.from(alias.keys());
const javaScriptProvider = {
  selector: { scheme: "file", language: "javascript" },
  provider: {
    provideCompletionItems,
    provideDocumentLinks,
    provideDefinition,
  },
  triggerCharacters,
};

function importStringRange(line, position) {
  const textToPosition = line.substring(0, position.character);
  const slashPosition = textToPosition.lastIndexOf("/");

  const startPosition = new vscode.Position(position.line, slashPosition + 1);
  const endPosition = position;

  return new vscode.Range(startPosition, endPosition);
}

function resolveAliasPath(path) {
  return alias.get(path);
}

async function provideDefinition(document, position, token) {
  const importPath = getFromString(
    document.getText(document.lineAt(position).range),
    position.character
  );
  const shouldAutoComplete = isAliasPath(importPath);

  if (!shouldAutoComplete) {
    return [];
  }

  const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
  const rootPath = workspace.uri.path;
  const resolvedPath = resolveAliasPath(importPath);

  console.log(resolvedPath);

  const uri = vscode.Uri.file(
    `${rootPath}${resolvedPath}/components/groups/GroupsPage.js`
  );

  return [new vscode.Location(uri, position)];
}

async function provideDocumentLinks(document, token) {
  console.log(document, token);
  const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
  const range = new vscode.Range(4, 16, 4, 18);
  const uri = vscode.Uri.file(
    `${workspace.uri.path}/src/components/groups/GroupsPage.js`
  );
  const documentLink = new vscode.DocumentLink(range, uri);

  return [documentLink];
}

async function provideCompletionItems(document, position) {
  const importPath = getFromString(
    document.getText(document.lineAt(position).range),
    position.character
  );
  const shouldAutoComplete = isAliasPath(importPath);

  if (!shouldAutoComplete) {
    return [];
  }

  const importRange = importStringRange(
    document.getText(document.lineAt(position).range),
    position
  );
  const textEdit = new vscode.TextEdit(importRange, "bar-import-foo");

  return [
    {
      label: "this works right",
      kind: vscode.CompletionItemKind.File,
      sortText: `b_abcde`,
      textEdit,
    },
  ];

  // const path = getPathOfFolderToLookupFiles(
  //   document.uri.fsPath,
  //   importPath,
  //   undefined,
  //   []
  // );

  // const childrens = await getChildrenOfPath(path);
  // const completions = childrens.map((child) =>
  //   createPathCompletionItem(child, {}, context)
  // );

  // return completions;
}

module.exports = javaScriptProvider;
