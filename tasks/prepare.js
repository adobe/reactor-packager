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

