const vscode = require('vscode');

function getImportPath(fullImportLine) {
  const firstQuotesPosition = Math.max(
    fullImportLine.indexOf('"'),
    fullImportLine.indexOf("'"),
    fullImportLine.indexOf('`')
  );
  const lastQuotesPosition = Math.max(
    fullImportLine.lastIndexOf('"'),
    fullImportLine.lastIndexOf("'"),
    fullImportLine.lastIndexOf('`')
  );
  const importPath = fullImportLine.substring(
    firstQuotesPosition + 1,
    lastQuotesPosition
  );

  return importPath;
}

function importStringRange(line, position) {
  const textToPosition = line.substring(0, position.character);
  const slashPosition = textToPosition.lastIndexOf('/');

  const startPosition = new vscode.Position(position.line, slashPosition + 1);
  const endPosition = position;

  return new vscode.Range(startPosition, endPosition);
}

module.exports = {
  getImportPath,
  importStringRange,
};
