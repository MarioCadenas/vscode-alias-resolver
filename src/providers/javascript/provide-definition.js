const vscode = require("vscode");
const path = require("path");
const FileManager = require("../../file-manager");

async function provideDefinition(document, position) {
  const fileManager = new FileManager(document, position);

  if (!fileManager.shouldAutoComplete()) {
    return [];
  }

  const filePath = fileManager.getFilePath();
  const { dir, base } = path.parse(filePath);
  const filesAndFolders = await fileManager.getFilesAndFolders(dir);
  const file = await fileManager.getFileFromFileNames(
    filesAndFolders,
    dir,
    base
  );
  const uri = vscode.Uri.file(path.join(file.directory, file.fileName));

  return [new vscode.Location(uri, position)];
}

module.exports = { provideDefinition };
