'use strict';

var zip = require('gulp-zip');
var del = require('del');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');

module.exports = function(gulp, options) {
  var dependencyTasks = [];
  if (options.buildViewTask) {
    dependencyTasks.push(options.buildViewTask);
  }

  gulp.task('package', dependencyTasks, function() {
    return gulp.src(getPaths(extensionDescriptor))
      .pipe(zip('package.zip'))
      .pipe(gulp.dest('./'));
  });

  gulp.task('package:clean', function() {
    return del([
      './package.zip'
    ]);
  });
};
