const { provideDefinition } = require("./provide-definition");
const { provideDocumentLinks } = require("./provide-document-links");
const { provideCompletionItems } = require("./provide-completion-items");
const { alias } = require("../../alias/alias-map");

const javaScriptProvider = {
  selector: { scheme: "file", language: "javascript" },
  providers: {
    provideCompletionItems,
    provideDocumentLinks,
    provideDefinition,
  },
  triggerCharacters: ["/", '"', "'", ...alias.keys()],
};

module.exports = javaScriptProvider;
