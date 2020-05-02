const vscode = require("vscode");
const path = require("path");
const {
  isAliasPath,
  resolveAliasPath,
  getImportPath,
  getAliasFromPath,
  getNodesInPath,
  isDirectory,
  isAbsolutePath,
} = require("../../utils");
const { DEFAULT_FILE } = require("../../constants");

class File {
  constructor(fileName, dir) {
    this.fileName = fileName;
    this.directory = dir;
    this.isDirectory = isDirectory(path.join(dir, fileName));
  }
}

function prepareFiles(files, dir) {
  return files.map((fileName) => new File(fileName, dir));
}

async function getFileFromFileNames(files, dir, file = DEFAULT_FILE) {
  const fileName = files.find((f) => {
    if (f.isDirectory) {
      return false;
    }

    const [fileWithoutExtension] = f.fileName.split(".");

    return file === fileWithoutExtension;
  });

  if (fileName) {
    return fileName;
  }

  const newDir = path.join(dir, file);
  const filesInPath = await getNodesInPath(newDir);
  const newFiles = prepareFiles(filesInPath, newDir);

  return getFileFromFileNames(newFiles, newDir);
}

async function provideDefinition(document, position, token) {
  const rawImportLine = document.getText(document.lineAt(position).range);
  const importPath = getImportPath(rawImportLine);
  const shouldAutoComplete = isAliasPath(importPath);

  if (!shouldAutoComplete) {
    return [];
  }

  const alias = getAliasFromPath(importPath);
  const workspace = vscode.workspace.getWorkspaceFolder(document.uri);
  const rootPath = workspace.uri.path;
  const resolvedAlias = resolveAliasPath(importPath);
  const resolvedPath = importPath.replace(alias, resolvedAlias);
  const filePath = isAbsolutePath(resolvedPath)
    ? resolvedPath
    : path.join(rootPath, resolvedPath);
  const { dir, base, ext } = path.parse(filePath);
  const filesInPath = await getNodesInPath(dir);
  const files = prepareFiles(filesInPath, dir);
  const file = await getFileFromFileNames(files, dir, base);
  const uri = vscode.Uri.file(path.join(file.directory, file.fileName));

  return [new vscode.Location(uri, position)];
}

module.exports = { provideDefinition };
