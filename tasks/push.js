'use strict';
var path = require('path');
var fs = require('fs');
var GulpSSH = require('gulp-ssh');
var os = require('os');
var through = require('through2');
var extensionDescriptor = require('./helpers/extensionDescriptor');
var getPaths = require('./helpers/getPackagePaths.js');
var packageData = require(path.join(process.cwd(), './package.json'));
var extensionName = packageData.name;
var request = require('request');
var argv = require('yargs').alias('U', 'user').alias('u', 'user').argv;

module.exports = function(gulp, options) {
  var all = [];
  var dependencyTasks = [];
  if (options.buildViewTask) {
    dependencyTasks.push(options.buildViewTask);
  }

  gulp.task('package:clearCdnCache', function(callback) {
    gulp.src(getPaths(extensionDescriptor), {base: process.cwd()})
      .pipe(through.obj(function (chunk, enc, cb) {
        if (fs.lstatSync(chunk.path).isFile()) {
          this.push(
            'http://assets.adobedtm.com/activation/extensionsdemo' +
            path.join(
              extensionName,
              chunk.relative
            ));
        }
        cb();
      }))
      .on('data', function (data) {
        all.push(data)
      }).on('end', function () {
        var requestData = {
          uri: "https://api.ccu.akamai.com/ccu/v2/queues/default",
          method: "POST",
          json: {
            objects: all
          }
        };

        if (argv.user) {
          var credentials = argv.user.split(':');
          requestData.auth = {
            user: credentials[0],
            pass: credentials[1],
            sendImmediately: false
          };
        }

        request(requestData, function (error, response, body) {
          console.log(body);
          callback();
        });
      });
  });

  gulp.task('package:pushPackageToCdn', dependencyTasks, function() {
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

    return gulp.src(getPaths(extensionDescriptor), {base: process.cwd()})
      .pipe(gulpSSH.dest(path.join(config.basePath, extensionName)));
  });

  gulp.task('package:push', ['package:pushPackageToCdn', 'package:clearCdnCache']);
};
