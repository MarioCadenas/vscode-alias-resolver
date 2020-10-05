const vscode = require('vscode');
const { configureFile } = require('../config');

function registerCommands() {
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigFile',
    configureFile
  );
}

module.exports = { registerCommands };
