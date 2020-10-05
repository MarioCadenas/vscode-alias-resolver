const vscode = require('vscode');
const path = require('path');

function getConfig() {
  const { file, path } = vscode.workspace.getConfiguration('alias-resolver');

  return {
    file,
    path,
  };
}

function updateConfig(file) {
  const config = vscode.workspace.getConfiguration('alias-resolver');

  return config.update('file', file, vscode.ConfigurationTarget.Workspace);
}

async function configureFile() {
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

  const fileName = path.basename(selectedFilePath);

  await updateConfig(fileName);

  return fileName;
}

module.exports = {
  getConfig,
  updateConfig,
  configureFile,
};
