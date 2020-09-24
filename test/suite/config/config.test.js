const vscode = require('vscode');
const myExtension = require('../../../extension');

describe('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  it('foo', () => {
    expect(1).toBe(1);
  });

  it('test not failing', () => {
    expect(1).toBe(1);
  });
});
