# @adobe/reactor-packager

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-packager.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-packager)

This project provides a command-line utility for packaging a Launch extension into a zip file. While using this utility is not necessary, it will validate your extension and make an effort to exclude anything from the zip file not necessary for the extension to run properly.

For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

## Usage

Before running the packager, you must first have [Node.js](https://nodejs.org/en/) installed on your computer. Your npm version (npm comes bundled with Node.js) will need to be at least 5.2.0. You can check the installed version by running the following command from a command line:
                                                                                                      
```
npm -v
```

Once Node.js is installed, run the packager by executing the following command from the command line within your project's directory:

```
npx @adobe/reactor-packager
```

