const path = require('path');
const vscode = require('vscode');
const {
  getNodesInPath,
  isAliasPath,
  getImportPath,
  getAliasFromPath,
  resolveAliasPath,
} = require('../utils');
const { DEFAULT_FILE } = require('../constants');
const File = require('./file');

class FileManager {
  constructor(document, position) {
    this.document = document;
    this.position = position;
    this.importPath = getImportPath(this.getRawImportLine());
  }

  getRawImportLine() {
    return this.document.getText(this.document.lineAt(this.position).range);
  }

  getImportPath(path) {
    return getImportPath(path);
  }

  getFilePath() {
    const alias = getAliasFromPath(this.importPath);
    const workspace = vscode.workspace.getWorkspaceFolder(this.document.uri);
    const rootPath = workspace.uri.path;
    const resolvedAlias = resolveAliasPath(this.importPath);
    const resolvedPath = this.importPath.replace(alias, resolvedAlias);

    return path.isAbsolute(resolvedPath)
      ? resolvedPath
      : path.join(rootPath, resolvedPath);
  }

  shouldAutoComplete() {
    return isAliasPath(this.importPath);
  }

  prepareFiles(files, dir) {
    return files.map((fileName) => new File(fileName, dir));
  }

  async getFilesAndFolders(path) {
    const filesInPath = await getNodesInPath(path);

    return this.prepareFiles(filesInPath, path);
  }

  async getFileFromFileNames(files, dir, file = DEFAULT_FILE) {
    const fileName = files.find((f) => {
      if (f.isDirectory) {
        return false;
      }

      const [fileWithoutExtension] = f.fileName.split('.');

      return file === fileWithoutExtension;
    });

    if (fileName) {
      return fileName;
    }

    const newDir = path.join(dir, file);
    const filesInPath = await getNodesInPath(newDir);
    const newFiles = this.prepareFiles(filesInPath, newDir);

    return this.getFileFromFileNames(newFiles, newDir);
  }
}

module.exports = FileManager;
