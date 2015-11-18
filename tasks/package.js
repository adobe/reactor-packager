'use strict';

var path = require('path');
var zip = require('gulp-zip');
var del = require('del');

var extensionDescriptor = require('./helpers/extensionDescriptor');
var types = ['events', 'conditions', 'actions', 'dataElements', 'resources'];

var R = require('ramda');
var getKeyValue = R.curry(function(key, obj) { return obj[key]; });
var getKeysFromObj = R.curry(function(obj, key) { return obj[key]; });
var prependBasePath = R.curry(function(basePath, item) { return [basePath, item].join('/'); });
var notEmpty = function(item) { return !!(item); };

var getLibPaths = function(descriptor, types) {
  var getDescriptorKeys = R.compose(
    R.flatten,
    R.filter(notEmpty),
    R.map(getKeysFromObj(descriptor))
  );

  var getPaths = R.compose(
    R.map(prependBasePath(extensionDescriptor.libBasePath)),
    R.filter(notEmpty),
    R.map(getKeyValue('libPath')),
    getDescriptorKeys
  );

  return getPaths(types);
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

module.exports = function(gulp, options) {
  var dependencyTasks = [];

  if (options.buildViewTask) {
    dependencyTasks.push(options.buildViewTask);
  }

  gulp.task('package', dependencyTasks, function() {
    return gulp.src(getPaths(extensionDescriptor, types), {base: './'})
      .pipe(zip('package.zip'))
      .pipe(gulp.dest('./'));
  });

  gulp.task('package:clean', function() {
    return del([
      './package.zip'
    ]);
  });
};
