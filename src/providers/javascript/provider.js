const { provideDefinition } = require('./provide-definition');
const { provideCompletionItems } = require('./provide-completion-items');
const { alias } = require('../../alias/alias-map');

const javaScriptProvider = {
  selector: { scheme: 'file', language: 'javascript' },
  providers: {
    provideCompletionItems,
    provideDefinition,
  },
  triggerCharacters: ['/', '"', "'", ...alias.keys()],
};

module.exports = javaScriptProvider;
