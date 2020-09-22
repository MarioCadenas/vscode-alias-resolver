const { Parser } = require('acorn');
const walk = require('acorn-walk');
const { EXPRESSION_TYPES } = require('./types');
const { alias } = require('../alias/alias-map');

class ConfigParser {
  static createMappingsFromConfig(rawText, ctx) {
    const ast = Parser.parse(rawText);
    const { __dirname, __process, path } = ctx;

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

    for (const [k, v] of alias.entries()) {
      console.log(`${k}: ${v}`);
    }
  }
}

module.exports = { ConfigParser };

function getArguments(args) {
  return args.map((arg) => arg.name || arg.raw);
}

function buildCallExpression(node) {
  const { callee } = node;
  const objName = callee.object.name;
  const prop = callee.property.name;
  const args = getArguments(node.arguments).toString();

  return `${objName}.${prop}(${args})`;
}

function CallExpression(node) {
  const callExpression = buildCallExpression(node);
  console.log(callExpression);
  // alias.set(key, eval(call));
}
