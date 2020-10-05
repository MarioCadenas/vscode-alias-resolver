const vscode = require('vscode');
const { javascriptProvider } = require('./javascript');

function registerProviders(context) {
  const {
    provideCompletionItems,
    provideDefinition,
  } = javascriptProvider.providers;

  const completionItemDisposable = vscode.languages.registerCompletionItemProvider(
    javascriptProvider.selector,
    { provideCompletionItems },
    ...(javascriptProvider.triggerCharacters || [])
  );

  const definitionDisposable = vscode.languages.registerDefinitionProvider(
    javascriptProvider.selector,
    { provideDefinition }
  );

  context.subscriptions.push(completionItemDisposable, definitionDisposable);
}

module.exports = { registerProviders };
