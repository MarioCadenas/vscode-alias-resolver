const vscode = require('vscode');

class UserConfig {
  // This is needed to keep a fresh new reference to the config.
  get _config() {
    return vscode.workspace.getConfiguration('alias-resolver');
  }

  getConfig() {
    return this._config;
  }

  _updateField(field, value) {
    return this._config.update(
      field,
      value,
      vscode.ConfigurationTarget.Workspace
    );
  }

  updateConfig(file, type, accessPath) {
    return Promise.all([
      this._updateField('file', file),
      this._updateField('type', type),
      this._updateField('accessPath', accessPath),
    ]);
  }

  async updateConfigFile() {
    const file = await this.showDialogToGetFile();

    this._updateField('file', file);
  }

  async updateConfigType() {
    const type = await this.showDialogToGetType();

    this._updateField('type', type);
  }

  async updateConfigAccessPath() {
    const accessPath = await this.showDialogToGetAccessPath();

    this._updateField('accessPath', accessPath);
  }

  async configureExtensionSettings() {
    const file = await this.showDialogToGetFile();
    const type = await this.showDialogToGetType();
    const accessPath = await this.showDialogToGetAccessPath();

    await this.updateConfig(file, type, accessPath);

    return { file, type, accessPath };
  }

  async showDialogToGetType() {
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

  async showDialogToGetAccessPath() {
    const accessPath = await vscode.window.showInputBox({
      placeHolder: 'resolve.alias',
      prompt:
        'The access path to the object where the alias are. Leave empty if aliases are at the root of the object',
    });

    return accessPath;
  }

  async showDialogToGetFile() {
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
    const workspaceRootPath = this.getWorkspaceRootPath();

    return selectedFilePath.replace(workspaceRootPath + '/', '');
  }

  getWorkspaceRootPath() {
    return vscode.workspace.workspaceFolders[0].uri.path;
  }
}

module.exports = new UserConfig();
