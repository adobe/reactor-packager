'use strict';

var fs = require('fs');
var archiver = require('archiver');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');

module.exports = function() {
  var output = fs.createWriteStream('package.zip');
  var zipArchive = archiver('zip');

  zipArchive.pipe(output);

  var filepaths = getPaths(extensionDescriptor);

  filepaths.forEach(function(filepath) {
    zipArchive.file(filepath);
  });

  zipArchive.finalize();
};
