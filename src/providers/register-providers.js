const vscode = require('vscode');
const getJavascriptProvider = require('./javascript');
const alias = require('../alias/alias-map');

function registerProviders(context) {
  const javascriptProvider = getJavascriptProvider(alias);
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
