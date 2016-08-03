'use strict';

var fs = require('fs');
var path = require('path');
var os = require('os');
var Client = require('ssh2').Client;

var clientDefaults = {
  port: 22,
  host: 'adobetag.upload.akamai.com',
  username: 'sshacs',
  privateKey: fs.readFileSync(path.join(os.homedir(), '.ssh/dtm.akamai.prod')),
  basePath: '/126057/activation/extensionsdemo/'
};

var extensionDescriptor = require('./helpers/extensionDescriptor');
var localPaths = require('./helpers/getPackagePaths.js')(extensionDescriptor);
var extensionName = extensionDescriptor.name;
var baseDestDir = clientDefaults.basePath;

var putFiles = function(sftp) {
  if (localPaths.length === 0) {
    console.log('All files were uploaded.');
    process.exit(0);
  }

  var localPath = localPaths.shift();
  var destPath = path.join(baseDestDir, extensionName, localPath);

  recursiveMkDirIfNotExists(
    sftp,
    baseDestDir,
    path.dirname(destPath.replace(baseDestDir, '')).split(path.sep),
    function () {
      sftp.fastPut(localPath, destPath, function (err) {
        if (err) {
          throw err;
        } else {
          console.log('Uploaded: ', localPath + ' -> ' + destPath);
          putFiles(sftp);
        }
      });
    }
  );
};

var recursiveMkDirIfNotExists = function (sftp, baseDirPath, dirPaths, cb) {
  if (dirPaths.length === 0) {
    cb();
    return;
  }

  var dirPath = path.join(baseDirPath, dirPaths.shift());
  sftp.stat(dirPath, function(err) {
    if (err) {
      if (err.message !== 'No such file') {
        console.log(err);
        process.exit(1);
      }

      sftp.mkdir(dirPath, function (err) {
        if (err) {
          console.log(err);
          process.exit(1);
        }

        console.log('Create directory: ', dirPath);
        recursiveMkDirIfNotExists(sftp, dirPath, dirPaths, cb);
      });
    } else {
     recursiveMkDirIfNotExists(sftp, dirPath, dirPaths, cb);
    }
  });
};

module.exports = function () {
  var conn = new Client();
  conn.on('ready', function() {
    console.log('Client :: ready');
    conn.sftp(function(err, sftp) {
      if (err) throw err;
      putFiles(sftp);
    });
  }).connect(clientDefaults);
};

