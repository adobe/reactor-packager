/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2016 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by all applicable intellectual property
 * laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

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
