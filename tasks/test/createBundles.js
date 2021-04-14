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

// console.log('about to exec')

var errorHandler = function(error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout:\n${stdout}`);
}.bind(this);

// invoke the packager and bundle to test-dist
exec(
  '../../tasks/index.js --output-dir ../../test-dist',
  { cwd: path.resolve(__dirname, '../../spec/extension-resources') },
  errorHandler
);

// copy files to bundle a circular dependency version
var specDirectory = path.resolve(__dirname, '../../spec');
var commandsArray = [
  'cp -r extension-resources/* circular-extension',
  'rm -f circular-extension/src/lib/sharedModules/*.js',
  'rm -r circular-extension/extension.json',
  'cp temporary-files/*.js circular-extension/src/lib/sharedModules',
  'cp temporary-files/extension.json circular-extension/extension.json'
]
exec(commandsArray.join(' && '), { cwd: specDirectory }, errorHandler);


// invoke the packager and bundle to test-dist
exec(
  '../../tasks/index.js --output-dir ../../test-dist',
  { cwd: path.resolve(__dirname, '../../spec/circular-extension') },
  errorHandler
);


