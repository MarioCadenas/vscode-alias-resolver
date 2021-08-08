const vscode = require('vscode');
const { Parser } = require('acorn');
const codeGenerator = require('escodegen');
const { parse } = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;
const walk = require('acorn-walk');
const alias = require('../alias/alias-map');
const get = require('lodash.get');

const TYPES = {
  WEBPACK: 'webpack',
  ROLLUP: 'rollup',
  CUSTOM: 'custom',
};

const ACCESS_PATHS = {
  [TYPES.WEBPACK]: 'resolve.alias',
  [TYPES.CUSTOM]: '',
  [TYPES.ROLLUP]: '',
};

class ConfigParser {
  _webpackAdapter(fileConfig) {
    return get(fileConfig, ACCESS_PATHS[TYPES.WEBPACK]);
  }

  _rollupAdapter(rawText) {
    const ast = Parser.parse(rawText);
    const babelAst = parse(rawText);
    const obj = {};

    traverse(babelAst, {
      CallExpression(node) {
        if (node.node.callee.name === 'alias') {
          const res = generate(node);
          console.log(res);
        }
      },
    });

    walk.simple(ast, {
      CallExpression(node) {
        if (node.callee.name === 'alias') {
          const result = codeGenerator.generate(node);

          node.arguments.forEach((arg) => {
            arg.properties.forEach((prop) => {
              const key = prop.key.value;
              const value = prop.value;

              walk.simple(value, {
                Literal(node) {
                  key && node.value && (obj[key] = node.value);
                },
              });
            });
          });
        }
      },
    });

    return obj;
  }

  _customConfigAdapter(fileConfig, accessPath = ACCESS_PATHS[TYPES.CUSTOM]) {
    return get(fileConfig, accessPath, fileConfig);
  }

  async createMappingsFromConfig(
    fileConfig,
    options = { type: TYPES.WEBPACK },
    path
  ) {
    let objWithAlias = {};
    const document = await vscode.workspace.openTextDocument(path);
    const text = document.getText();

    switch (options.type) {
      case TYPES.WEBPACK:
        objWithAlias = this._webpackAdapter(fileConfig);
        break;
      case TYPES.ROLLUP:
        objWithAlias = this._rollupAdapter(text);
        break;
      case TYPES.CUSTOM:
        objWithAlias = this._customConfigAdapter(
          fileConfig,
          options.accessPath
        );
        break;
    }

    for (const [key, path] of Object.entries(objWithAlias)) {
      alias.set(key, path);
    }
    console.log(alias);
  }
}

module.exports = { ConfigParser: new ConfigParser() };
