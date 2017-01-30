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

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var matchRequires = require('match-requires');

// We're using `is-empty` package becasue isEmpty from Ramda does NOT detect `null` or `undefined`
// as empty values.
var isEmpty = require('is-empty');

var R = require('ramda');

var getAvailableTypes = function(descriptor) {
  var allTypes = ['events', 'conditions', 'actions', 'dataElements', 'helpers'];
  return R.intersection(allTypes, R.keys(descriptor));
};

var recursivelyAccumulateRequiredPaths = function(accumPaths, hostPath) {
  accumPaths.push(hostPath);
  var source = fs.readFileSync(hostPath, {encoding: 'utf8'});
  matchRequires(source)
    // matchRequires returns objects with some cruft. We just care about the module paths.
    .map(result => result.module)
    // Only care about relative paths. We don't care about require statements for core modules.
    .filter(module => module.indexOf('.') === 0)
    // Allow extension devs to require JS files without the js extension
    .map(module => path.extname(module) === '.js' ? module : module + '.js')
    // Add the paths to our list and recursively search their associated files.
    .reduce(function(accumPaths, relativeRequiredPath) {
      var normalizedRequiredPath = path.join(path.dirname(hostPath), relativeRequiredPath);
      return recursivelyAccumulateRequiredPaths(accumPaths, normalizedRequiredPath);
    }, accumPaths);
  return accumPaths;
};

var getLibPaths = function(descriptor) {
  // We're getting the available types values from the descriptor. We flatten the array structure
  // and then get all the `libPath` values for all the delegates. We're dropping any empty value we
  // got at this point and we append the base path to the remaining values.
  var getPaths = R.compose(
    R.uniq,
    R.concat(descriptor.hostedLibFiles || []),
    R.reduce(recursivelyAccumulateRequiredPaths, []),
    R.filter(R.complement(isEmpty)),
    R.concat([descriptor.iconPath]),
    R.pluck('libPath'),
    R.flatten,
    R.props(getAvailableTypes(descriptor))
  );

  return getPaths(descriptor);
};

var getViewPaths = function(descriptor) {
  return glob.sync(
    path.join(descriptor.viewBasePath, '/**'),
    {
      nodir: true
    }
  );
};

var getExtensionJsonPath = function() {
  return ['extension.json'];
};

var getPaths = function(descriptor, types) {
  return getViewPaths(descriptor)
    .concat(getLibPaths(descriptor, types))
    .concat(getExtensionJsonPath());
};

module.exports = getPaths;
