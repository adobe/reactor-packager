/*!
 * ADOBE SYSTEMS INCORPORATED
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a
 * source other than Adobe, then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

'use strict';

var fs = require('fs');
var archiver = require('archiver');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');

module.exports = function() {
  var output = fs.createWriteStream(
   'package-' + extensionDescriptor.name + '-' + extensionDescriptor.version + '.zip'
  );
  var zipArchive = archiver('zip');

  zipArchive.pipe(output);

  var filepaths = getPaths(extensionDescriptor);

  filepaths.forEach(function(filepath) {
    zipArchive.file(filepath);
  });

  zipArchive.finalize();
};
