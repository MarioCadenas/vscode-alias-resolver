const { alias } = require('../alias/alias-map');
const get = require('lodash.get');

const TYPES = {
  WEBPACK: 'webpack',
  ROLLUP: 'rollup',
  CUSTOM: 'custom',
};

class ConfigParser {
  _webpackAdapter(fileConfig) {
    return get(fileConfig, ACCESS_PATHS[TYPES.WEBPACK]);
  }

  _customConfigAdapter(fileConfig, accessPath = ACCESS_PATHS[TYPES.CUSTOM]) {
    return get(fileConfig, accessPath, fileConfig);
  }

  createMappingsFromConfig(fileConfig, options = { type: TYPES.WEBPACK }) {
    let objWithAlias = {};

    switch (options.type) {
      case TYPES.WEBPACK:
        objWithAlias = this._webpackAdapter(fileConfig);
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

    console.log(alias.keys(), alias.values());
  }
}

const ACCESS_PATHS = {
  [TYPES.WEBPACK]: 'resolve.alias',
  [TYPES.CUSTOM]: '',
};

module.exports = { ConfigParser: new ConfigParser() };
