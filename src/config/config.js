const vscode = require('vscode');

function getConfig() {
  const { file, path } = vscode.workspace.getConfiguration('alias-resolver');

  return {
    file,
    path,
  };
}

module.exports = {
  getConfig,
};
