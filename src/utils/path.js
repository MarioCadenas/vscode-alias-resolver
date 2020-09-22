const { alias } = require('../alias/alias-map');
const { readdir } = require('fs');
const { promisify } = require('util');

const readdirAsync = promisify(readdir);

function isAliasPath(path) {
  const aliasKeys = Array.from(alias.keys());

  return aliasKeys.some(
    (aliasKey) => aliasKey === path || path.startsWith(aliasKey)
  );
}

function getAliasFromPath(path) {
  const aliasKeys = sortAliasFromLongerToShorter(Array.from(alias.keys()));

  return aliasKeys.find(
    (aliasKey) =>
      aliasKey === path || aliasKey.startsWith(path) || path.includes(aliasKey)
  );
}

function sortAliasFromLongerToShorter(aliasKeys) {
  return [...aliasKeys].sort((a, b) => {
    if (a.length > b.length) return -1;
    if (b.length > a.lenght) return 1;
    return 0;
  });
}

function resolveAliasPath(path) {
  const aliasFromPath = alias.get(path);

  if (aliasFromPath) {
    return aliasFromPath;
  }

  const aliasKeys = Array.from(alias.keys());
  const sortedAlias = sortAliasFromLongerToShorter(aliasKeys);

  const matchingAlias = sortedAlias.find((aliasKey) =>
    path.startsWith(aliasKey)
  );

  return alias.get(matchingAlias) || '';
}

function isAbsolutePath(path) {
  return path.startsWith('/');
}

async function getNodesInPath(path) {
  try {
    return readdirAsync(path);
  } catch (error) {
    return [];
  }
}

module.exports = {
  isAliasPath,
  isAbsolutePath,
  resolveAliasPath,
  getNodesInPath,
  getAliasFromPath,
};
