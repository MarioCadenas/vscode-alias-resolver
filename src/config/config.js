const vscode = require('vscode');

function getConfig() {
  const { file, path, type } = vscode.workspace.getConfiguration(
    'alias-resolver'
  );

  return {
    file,
    path,
    type,
  };
}

function updateConfig(file, type) {
  const config = vscode.workspace.getConfiguration('alias-resolver');

  return Promise.all([
    config.update('file', file, vscode.ConfigurationTarget.Workspace),
    config.update('type', type, vscode.ConfigurationTarget.Workspace),
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

async function configureExtensionSettings() {
  const file = await showDialogToGetFile();
  const type = await showDialogToGetType();

  await updateConfig(file, type);

  return { file, type };
}

async function showDialogToGetType() {
  const typeResult = await vscode.window.showQuickPick([
    {
      label: 'webpack',
      description: 'If your config is a typical webpack config.',
    },
    {
      label: 'custom',
      description:
        'If you are using a custom config and you will define how to access to the object.',
    },
  ]);

  return typeResult.label;
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
};
