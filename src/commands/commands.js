const vscode = require('vscode');
const { updateConfigFile, updateConfigType } = require('../config');

function registerCommands() {
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigFile',
    updateConfigFile
  );
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigType',
    updateConfigType
  );
}

module.exports = { registerCommands };
