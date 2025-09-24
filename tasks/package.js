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

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import archiver from 'archiver';
import chalk from 'chalk';
import extensionDescriptor from './helpers/extensionDescriptor.js';
import fs from 'fs';
import getPaths from './helpers/getPackagePaths.js';
import path from 'path';
import process from 'process';

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .options({
    v: {
      alias: 'verbose',
      describe: 'Display extra information, if available',
      type: 'boolean'
    },
    o: {
      alias: 'out',
      describe: 'The directory path or file path to write the archive',
      type: 'string'
    },
    'dry-run': {
      describe: 'Preview how the archive will be built',
      type: 'boolean'
    }
  })
  .argv;

var getOutputLocation = function() {
  var defaultFileName = 'package-' + extensionDescriptor.name + '-' + extensionDescriptor.version + '.zip';

  if (argv.out) {
    var diskLocation = path.resolve(argv.out);

    // We're treating their entire output as a directory, unless they try to terminate their string with some kind
    var ext = path.extname(diskLocation);
    if (Boolean(ext) && ext !== '.zip') {
      console.error(chalk.red('The output extension must be ".zip"'));
      process.exit(1);
    } else if (!Boolean(ext)) {
      // they gave us a directory only, append our file name
      diskLocation = path.resolve(diskLocation, defaultFileName);
    }
    var dirLocation = path.dirname(diskLocation);
    // if the directory doesn't exist, create it.
    if (!fs.existsSync(dirLocation)) {
      fs.mkdirSync(dirLocation);
    }

    return diskLocation;
  }

  return path.resolve(defaultFileName);
};

var fileExists = function(filepath) {
  var fileDirectory = path.dirname(filepath);
  var folderFiles = fs.readdirSync(fileDirectory);
  var fileBaseName = path.basename(filepath);

  return folderFiles.indexOf(fileBaseName) !== -1;
};

export default function() {
  var filepaths = getPaths(extensionDescriptor);
  var outputLocation = getOutputLocation();

  if (argv.dryRun) {
    filepaths.forEach(function(filepath) {
      if (!fileExists(filepath)) {
        var error = 'Cannot find file: ' + filepath;
        console.error(chalk.red(error));
        process.exit(1);
      }
    });

    if (argv.verbose) {
      filepaths.forEach(function(filePath) {
        console.log(filePath);
      });
    }
    console.log(chalk.green(filepaths.length + ' files will be written to ' + outputLocation));
  } else {
    var output = fs.createWriteStream(outputLocation);
    var zipArchive = archiver('zip');
    zipArchive.pipe(output);

    filepaths.forEach(function(filepath) {
      if (!fileExists(filepath)) {
        var error = 'Cannot find file: ' + filepath;
        console.error(chalk.red(error));
        process.exit(1);
      }
      zipArchive.file(filepath);
    });

    zipArchive.finalize();

    console.log(chalk.green('wrote archive (' + filepaths.length + ' files) to ' + outputLocation));
  }
};
