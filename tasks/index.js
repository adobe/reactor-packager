#!/usr/bin/env node

'use strict';

var task = process.argv.slice(2)[0];

switch (task) {
  case 'push':
    require('./push')();
    break;
  case 'prepare':
    require('./prepare')();
    break;
  case 'package':
  default:
    require('./package')();
    break;
}
