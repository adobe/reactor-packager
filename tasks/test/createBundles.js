#!/usr/bin/env node

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

var path = require('path');
var exec = require('child_process').exec;

var errorHandler = function(error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    process.exit(1);
    return;
  }

  console.log(`stdout:\n${stdout}`);
}.bind(this);

// invoke the packager and bundle to test-dist
var binScriptPath = path.resolve(__dirname, '../index.js');
var testDistPath = path.resolve(__dirname, '../../test-dist');

console.log('Packaging example-extension');
var packageExample = [binScriptPath, '-o', testDistPath+'/non-circular.zip'].join(' ');
exec(
  packageExample,
  { cwd: path.resolve(__dirname, 'example-extension') },
  errorHandler
);

// copy files to bundle a circular dependency version
var createCircularDependencyExtension = [
  'cp -r example-extension/* circular-extension', // use example-extension for the base files
  'rm -f circular-extension/src/lib/sharedModules/*.js', // remove sharedModules, where we will introduce a circular dependency
  'rm -r circular-extension/extension.json',
  'cp circular-extension-files/*.js circular-extension/src/lib/sharedModules', // introduce a circular-dependency
  'cp circular-extension-files/extension.json circular-extension/extension.json'
];
exec(createCircularDependencyExtension.join(' && '), { cwd: path.resolve(__dirname) }, errorHandler);

// invoke the packager and bundle to test-dist
console.log('Packaging circular-extension');
var packageCircular = [binScriptPath, '-o', testDistPath+'/circular.zip'].join(' ');
exec(
  packageCircular,
  { cwd: path.resolve(__dirname, 'circular-extension') },
  errorHandler
);


