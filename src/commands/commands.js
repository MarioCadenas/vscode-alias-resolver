const vscode = require('vscode');
const {
  updateConfigFile,
  updateConfigType,
  updateConfigAccessPath,
} = require('../config');

function registerCommands() {
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigFile',
    updateConfigFile
  );
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigType',
    updateConfigType
  );
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigAccessType',
    updateConfigAccessPath
  );
}

module.exports = { registerCommands };
