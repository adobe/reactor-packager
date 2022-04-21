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
var glob = require('glob');
var fs = require('fs');
var matchRequires = require('./matchRequires');

var R = require('ramda');

var getAvailableTypes = function(descriptor) {
  var allTypes = ['events', 'conditions', 'actions', 'dataElements', 'sharedModules'];
  return R.intersection(allTypes, R.keys(descriptor));
};

var recursivelyAccumulateRequiredPaths = function(accumPaths, hostPath) {
  accumPaths.push(hostPath);
  var source = fs.readFileSync(hostPath, {encoding: 'utf8'});
  matchRequires(source, true)
    // matchRequires returns objects with some cruft. We just care about the module paths.
    .map(result => result.name)
    // Only care about relative paths. We don't care about require statements for core modules.
    .filter(module => module.indexOf('.') === 0)
    // Allow extension devs to require JS files without the js extension
    .map(module => path.extname(module) === '.js' ? module : module + '.js')
    // Add the paths to our list and recursively search their associated files.
    .reduce(function(accumPaths, relativeRequiredPath) {
      var normalizedRequiredPath = path.join(path.dirname(hostPath), relativeRequiredPath);

      // only process the require statements for a file we haven't seen yet to avoid circular imports
      if (accumPaths.indexOf(normalizedRequiredPath) === -1) {
        return recursivelyAccumulateRequiredPaths(accumPaths, normalizedRequiredPath);
      }

      return accumPaths;
    }, accumPaths);
  return accumPaths;
};

var ensureArray = function (value) {
  if (Array.isArray(value)) {
    return value;
  } else if (value != null) {
    return [value];
  } else {
    return [];
  }
}

var getLibPaths = function(descriptor) {
  // mobile doesn't have libPaths on their delegate modules.
  if (descriptor.platform === 'mobile') {
    return [];
  }

  // We're getting the available types values from the descriptor. We flatten the array structure
  // and then get all the `libPath` values for all the delegates. We're dropping any empty value we
  // got at this point and we append the base path to the remaining values.
  var getPaths = R.compose(
    R.concat(ensureArray(descriptor.iconPath)),
    R.concat(ensureArray(descriptor.hostedLibFiles)),
    R.reduce(recursivelyAccumulateRequiredPaths, []),
    R.concat(ensureArray(descriptor.main)),
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
