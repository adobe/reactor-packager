'use strict';
var path = require('path');
var fs = require('fs');
var GulpSSH = require('gulp-ssh');
var os = require('os');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');
var packageData = require(path.join(process.cwd(), './package.json'));

module.exports = function(gulp, options) {
  var dependencyTasks = [];
  if (options.buildViewTask) {
    dependencyTasks.push(options.buildViewTask);
  }

  gulp.task('package:push', dependencyTasks, function(callback) {
    var extensionName = packageData.name;

    var config = {
      host: 'adobetag.upload.akamai.com',
      port: 22,
      username: 'sshacs',
      privateKey: fs.readFileSync(path.join(os.homedir(), '.ssh/dtm.akamai.prod')),
      basePath: '/126057/activation/extensionsdemo/'
    };

    var gulpSSH = new GulpSSH({
      ignoreErrors: false,
      sshConfig: config
    });

    gulp.src(getPaths(extensionDescriptor), {base: process.cwd()})
      .pipe(gulpSSH.dest(path.join(config.basePath, extensionName)))
      .on('finish', callback);
  });
};
