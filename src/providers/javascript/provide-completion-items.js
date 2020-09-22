const vscode = require("vscode");
const path = require("path");
const { importStringRange } = require("../../utils");
const FileManager = require("../../file-manager");

function toCompletion(importRange, fileOrFolder) {
  const { name } = path.parse(fileOrFolder.fileName);

  return {
    label: fileOrFolder.fileName,
    kind:
      vscode.CompletionItemKind[
        fileOrFolder.isDirectory ? "Directory" : "File"
      ],
    sortText: `a_${fileOrFolder.fileName}`,
    textEdit: new vscode.TextEdit(importRange, name),
  };
}

async function provideCompletionItems(document, position) {
  const fileManager = new FileManager(document, position);

  if (!fileManager.shouldAutoComplete()) {
    return [];
  }

  const filePath = fileManager.getFilePath();
  const filesAndFolders = await fileManager.getFilesAndFolders(filePath);
  const importRange = importStringRange(
    fileManager.getRawImportLine(),
    position
  );

  return filesAndFolders.map(toCompletion.bind(null, importRange));
}

module.exports = { provideCompletionItems };
