const { alias } = require("../alias/alias-map");

const isAliasPath = (path) => {
  const aliasKeys = Array.from(alias.keys());

  return aliasKeys.some(
    (aliasKey) =>
      aliasKey === path || aliasKey.startsWith(path) || path.includes(aliasKey)
  );
};

module.exports = {
  isAliasPath,
};
