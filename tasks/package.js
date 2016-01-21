'use strict';

var zip = require('gulp-zip');
var del = require('del');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');

module.exports = function(gulp, options) {
  var dependencyTasks = [];
  if (options && options.dependencyTasks) {
    options.dependencyTasks.forEach(function(task) {
      dependencyTasks.push(task);
    });
  }

  gulp.task('package', dependencyTasks, function() {
    return gulp.src(getPaths(extensionDescriptor), {base: './'})
      .pipe(zip('package.zip'))
      .pipe(gulp.dest('./'));
  });

  gulp.task('package:clean', function() {
    return del([
      './package.zip'
    ]);
  });
};
