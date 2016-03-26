'use strict';

var path = require('path');

// We're using `is-empty` package becasue isEmpty from Ramda does NOT detect `null` or `undefined`
// as empty values.
var isEmpty = require('is-empty');

var R = require('ramda');
var prependBasePath = R.curry(function(basePath, item) { return [basePath, item].join('/'); });

var getAvailableTypes = function(descriptor) {
  var allTypes = ['events', 'conditions', 'actions', 'dataElements', 'helpers'];
  return R.intersection(allTypes, R.keys(descriptor));
};

var getLibPaths = function(descriptor) {
  // We're getting the available types values from the descriptor. We flatten the array structure
  // and then get all the `libPath` values for all the delegates. We're dropping any empty value we
  // got at this point and we append the base path to the remaining values.
  var getPaths = R.compose(
    R.map(prependBasePath(descriptor.libBasePath)),
    R.filter(R.complement(isEmpty)),
    R.pluck('libPath'),
    R.flatten,
    R.props(getAvailableTypes(descriptor))
  );

  return getPaths(descriptor);
};

var getViewPaths = function(descriptor) {
  return [path.join(descriptor.viewBasePath, '/**')];
};

var getExtensionJsonPath = function() {
  return [path.resolve('extension.json')];
};

var getPaths = function(descriptor, types) {
  return getViewPaths(descriptor)
    .concat(getLibPaths(descriptor, types))
    .concat(getExtensionJsonPath());
};

module.exports = getPaths;
