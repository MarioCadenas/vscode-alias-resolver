const { provideDefinition } = require('./provide-definition');
const { provideCompletionItems } = require('./provide-completion-items');

function getJavascriptProvider(alias) {
  const aliasKeys = Array.from(alias.keys());

  return {
    selector: { scheme: 'file', language: 'javascript' },
    providers: {
      provideCompletionItems,
      provideDefinition,
    },
    triggerCharacters: ['/', '"', "'", ...aliasKeys],
  };
}

module.exports = getJavascriptProvider;
