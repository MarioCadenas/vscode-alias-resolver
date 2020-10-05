const { Parser } = require('acorn');
const walk = require('acorn-walk');
const { alias } = require('../alias/alias-map');

class ConfigParser {
  static createMappingsFromConfig(rawText) {
    const ast = Parser.parse(rawText);

    walk.simple(ast, {
      Property(node) {
        if (node.key.name === 'alias') {
          node.value.properties.forEach((prop) => {
            const key = prop.key.value;
            const value = prop.value;

            walk.simple(value, {
              Literal(node) {
                key && node.value && alias.set(key, node.value);
              },
            });
          });
        }
      },
      CallExpression(node) {
        if (node.callee.name === 'alias') {
          node.arguments.forEach((arg) => {
            arg.properties.forEach((prop) => {
              const key = prop.key.value;
              const value = prop.value;

              walk.simple(value, {
                Literal(node) {
                  key && node.value && alias.set(key, node.value);
                },
              });
            });
          });
        }
      },
    });
  }
}

module.exports = { ConfigParser };
