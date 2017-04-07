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

var chalk = require('chalk');
var validate = require('@adobe/reactor-validator');
var extensionDescriptor = require('./helpers/extensionDescriptor');

var error = validate(extensionDescriptor);

if (error) {
  console.error(chalk.red(error));
  process.exit(1);
}

var task = process.argv.slice(2)[0];

switch (task) {
  case 'prepare':
    require('./prepare')();
    break;
  case 'package':
  default:
    require('./package')();
    break;
}
