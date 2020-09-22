const fs = require('fs');

function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

module.exports = {
  isDirectory,
};
