'use strict';

var fse = require('node-fs-extra');
var copy = require('copy');

var extensionDescriptor = require('./helpers/extensionDescriptor');
var extensionName = extensionDescriptor.name;

module.exports = function() {
  var uploadDir = extensionName;

  var localPaths = require('./helpers/getPackagePaths.js')(extensionDescriptor);

  fse.removeSync(uploadDir);
  fse.mkdirsSync(uploadDir);
  copy.each(localPaths, uploadDir, function() {});
};

