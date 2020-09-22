const path = require('path');
const { isDirectory } = require('../utils');

class File {
  constructor(fileName, dir) {
    this.fileName = fileName;
    this.directory = dir;
    this.isDirectory = isDirectory(path.join(dir, fileName));
  }
}

module.exports = File;
