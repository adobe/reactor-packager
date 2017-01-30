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

