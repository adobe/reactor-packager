/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

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

