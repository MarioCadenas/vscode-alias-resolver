const vscode = require('vscode');

function getConfig() {
  const { file, type, accessPath } = vscode.workspace.getConfiguration(
    'alias-resolver'
  );

  return {
    file,
    type,
    accessPath,
  };
}

function updateConfig(file, type, accessPath) {
  const config = vscode.workspace.getConfiguration('alias-resolver');

  return Promise.all([
    config.update('file', file, vscode.ConfigurationTarget.Workspace),
    config.update('type', type, vscode.ConfigurationTarget.Workspace),
    config.update(
      'accessPath',
      accessPath,
      vscode.ConfigurationTarget.Workspace
    ),
  ]);
}

async function updateConfigFile() {
  const config = vscode.workspace.getConfiguration('alias-resolver');
  const file = await showDialogToGetFile();

  config.update('file', file, vscode.ConfigurationTarget.Workspace);
}

async function updateConfigType() {
  const config = vscode.workspace.getConfiguration('alias-resolver');
  const type = await showDialogToGetType();

  config.update('type', type, vscode.ConfigurationTarget.Workspace);
}

async function updateConfigAccessPath() {
  const config = vscode.workspace.getConfiguration('alias-resolver');
  const accessPath = await showDialogToGetAccessPath();

  config.update('accessPath', accessPath, vscode.ConfigurationTarget.Workspace);
}

async function configureExtensionSettings() {
  const file = await showDialogToGetFile();
  const type = await showDialogToGetType();
  const accessPath = await showDialogToGetAccessPath();

  await updateConfig(file, type, accessPath);

  return { file, type };
}

async function showDialogToGetType() {
  const typeResult = await vscode.window.showQuickPick([
    {
      label: 'webpack',
      detail: 'If your config is a typical webpack config.',
    },
    {
      label: 'custom',
      detail:
        'If you are using a custom config and you will define how to access to the object.',
    },
  ]);

  return typeResult.label;
}

async function showDialogToGetAccessPath() {
  const accessPath = await vscode.window.showInputBox({
    placeHolder: 'resolve.alias',
    prompt:
      'The access path to the object where the alias are. Leave empty if aliases are at the root of the object',
  });

  return accessPath;
}

async function showDialogToGetFile() {
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
  const workspaceRootPath = getWorkspaceRootPath();
  const fileName = selectedFilePath.replace(workspaceRootPath + '/', '');

  return fileName;
}

function getWorkspaceRootPath() {
  return vscode.workspace.workspaceFolders[0].uri.path;
}

module.exports = {
  configureExtensionSettings,
  getConfig,
  updateConfig,
  updateConfigFile,
  updateConfigType,
  updateConfigAccessPath,
};
