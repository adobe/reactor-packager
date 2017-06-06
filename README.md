# @adobe/reactor-packager

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-packager.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-packager)

This project provides a command-line utility for packaging a Launch extension into a zip file. While using this utility is not necessary, it will validate your extension and make an effort to exclude anything from the zip file not necessary for the extension to run properly.

For more information regarding Launch, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

## Installing the Packager

To use this project you will need to have [Node.js](https://nodejs.org/en/) installed on your computer. After you [download and install Node.js](https://nodejs.org/en/download/) you will also have access to the [npm](https://www.npmjs.com/) package manager for JavaScript. Your npm version will need to be at least 3.0.0. You can check the installed version by running the following command from a command line:

```
npm -v
```

After you have installed Node.js on your machine, you will need to initialize your project. Create a folder for your project if you don't already have one. Inside the folder, run

```
npm init
```

You will need to provide the information requested on the screen. After this process is complete, you should have a file called `package.json` inside your folder.

You will then need to install `@adobe/reactor-packager` and save it in your project's [`devDependencies`](https://docs.npmjs.com/files/package.json#devdependencies) by running

```
npm install @adobe/reactor-packager --save-dev
```

## Packaging

To build a `package.zip` file for your extension, run `node_modules/.bin/reactor-packager` from the command line within your project's directory. A zip file should appear in your project's directory.

Rather than type the path to the `reactor-packager` script each time you would like the run the packager, you may wish to set up a [script alias](https://docs.npmjs.com/misc/scripts) by adding a `scripts` node to your `package.json` as follows:

```javascript
{
  ...
  "scripts": {
    "package": "reactor-packager"
  }
  ...
}
```

Once this is in place, you may then run the packager by executing the command `npm run package` from the command line.
