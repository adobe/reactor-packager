#!/usr/bin/env node

'use strict';

var chalk = require('chalk');
var validate = require('@adobe/composer-validator');
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
