#!/usr/bin/env node

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

import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cross-platform helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Cross-platform helper to remove directory recursively
function rmDirSync(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

var errorHandler = function(error, stdout, stderr) {
  if (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
    return;
  }

  // Check if stderr contains only expected warnings (not actual errors)
  if (stderr) {
    const isOnlyExpectedWarnings = stderr
      .split('\n')
      .filter(line => line.trim()) // Remove empty lines
      .every(line =>
        line.includes('stripComments option not yet supported') ||
        line.trim() === '' // Allow empty lines
      );

    if (!isOnlyExpectedWarnings) {
      console.error(`stderr: ${stderr}`);
      process.exit(1);
      return;
    } else {
      // Just log expected warnings but don't fail
      console.log(`Expected warnings: ${stderr.trim()}`);
    }
  }

  console.log(`stdout:\n${stdout}`);
};

// Helper to run Node.js commands cross-platform
function runPackager(scriptPath, outputPath, workingDir, callback) {
  const child = spawn('node', [scriptPath, '-o', outputPath], {
    cwd: workingDir,
    stdio: 'pipe'
  });

  let stdout = '';
  let stderr = '';

  child.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  child.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  child.on('close', (code) => {
    if (code !== 0) {
      callback(new Error(`Process exited with code ${code}`), stdout, stderr);
    } else {
      callback(null, stdout, stderr);
    }
  });
}

// invoke the packager and bundle to test-dist
var binScriptPath = path.resolve(__dirname, '../../dist/index.js');
var testDistPath = path.resolve(__dirname, '../../test-dist');

// Ensure test-dist directory exists
if (!fs.existsSync(testDistPath)) {
  fs.mkdirSync(testDistPath, { recursive: true });
}

console.log('Packaging example-extension');
runPackager(
  binScriptPath,
  path.join(testDistPath, 'non-circular.zip'),
  path.resolve(__dirname, 'example-extension'),
  errorHandler
);

// Create circular dependency extension using cross-platform file operations
console.log('Setting up circular-extension...');
try {
  const exampleExtensionPath = path.resolve(__dirname, 'example-extension');
  const circularExtensionPath = path.resolve(__dirname, 'circular-extension');
  const circularFilesPath = path.resolve(__dirname, 'circular-extension-files');

  // Remove existing circular-extension if it exists
  rmDirSync(circularExtensionPath);

  // Copy example-extension to circular-extension
  copyDirSync(exampleExtensionPath, circularExtensionPath);

  // Remove existing sharedModules
  const sharedModulesPath = path.join(circularExtensionPath, 'src/lib/sharedModules');
  if (fs.existsSync(sharedModulesPath)) {
    const files = fs.readdirSync(sharedModulesPath);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        fs.unlinkSync(path.join(sharedModulesPath, file));
      }
    });
  }

  // Remove extension.json
  const extensionJsonPath = path.join(circularExtensionPath, 'extension.json');
  if (fs.existsSync(extensionJsonPath)) {
    fs.unlinkSync(extensionJsonPath);
  }

  // Copy circular dependency files
  const circularFiles = fs.readdirSync(circularFilesPath);
  circularFiles.forEach(file => {
    if (file.endsWith('.js')) {
      fs.copyFileSync(
        path.join(circularFilesPath, file),
        path.join(sharedModulesPath, file)
      );
    } else if (file === 'extension.json') {
      fs.copyFileSync(
        path.join(circularFilesPath, file),
        path.join(circularExtensionPath, file)
      );
    }
  });

  console.log('✅ Circular-extension setup complete');
} catch (setupError) {
  console.error('Error setting up circular-extension:', setupError.message);
  process.exit(1);
}

// invoke the packager and bundle to test-dist
console.log('Packaging circular-extension');
runPackager(
  binScriptPath,
  path.join(testDistPath, 'circular.zip'),
  path.resolve(__dirname, 'circular-extension'),
  errorHandler
);
