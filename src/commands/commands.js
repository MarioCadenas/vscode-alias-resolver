const vscode = require('vscode');

function registerCommands(userConfig) {
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigFile',
    userConfig.updateConfigFile.bind(userConfig)
  );
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigType',
    userConfig.updateConfigType.bind(userConfig)
  );
  vscode.commands.registerCommand(
    'alias-resolver.updateConfigAccessType',
    userConfig.updateConfigAccessPath.bind(userConfig)
  );
}

module.exports = { registerCommands };
