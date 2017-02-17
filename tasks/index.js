#!/usr/bin/env node

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
