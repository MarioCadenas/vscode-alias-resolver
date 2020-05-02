const vscode = require("vscode");

async function provideDocumentLinks(document, token) {
  const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
  const range = new vscode.Range(4, 16, 4, 18);
  const uri = vscode.Uri.file(
    `${workspace.uri.path}/src/components/groups/GroupsPage.js`
  );
  const documentLink = new vscode.DocumentLink(range, uri);

  return [documentLink];
}

module.exports = { provideDocumentLinks };
