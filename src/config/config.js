const vscode = require('vscode');

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

module.exports = {
  getConfig,
  updateConfig,
};
