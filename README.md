# Adobe Experience Platform Tags Extension Packager

[![npm (scoped)](https://img.shields.io/npm/v/@adobe/reactor-packager.svg?style=flat)](https://www.npmjs.com/package/@adobe/reactor-packager)

Adobe Experience Platform Tags is a next-generation tag management solution enabling simplified deployment of marketing technologies. For more information regarding Tags, please visit our [product website](http://www.adobe.com/enterprise/cloud-platform/launch.html).

This extension packager is a command-line utility for packaging a Tags extension into a zip file suitable to be uploaded to the system. While using this utility is not necessary, it will validate that your extension appears well-structured (e.g., files that are referenced exist in the directory) and make an effort to exclude anything from the zip file not necessary for the extension to operate.

For more information about developing an extension for Tags, please visit our [extension development guide](https://experienceleague.adobe.com/docs/experience-platform/tags/extension-dev/overview.html).

## Usage

Before running the packager, you must first have [Node.js](https://nodejs.org/en/) installed on your computer.

Once Node.js is installed, run the packager by executing the following command from the command line within your project's directory:

```
npx @adobe/reactor-packager
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](CONTRIBUTING.md) for more information.

To get started:

1. Install [node.js](https://nodejs.org/).
3. Clone the repository.
4. After navigating into the project directory, install project dependencies by running `npm install`.

To manually test your changes, first run the following command from the packager tool directory:

```
npm link
```

Then, in a directory containing an extension (any extension you would like to use for testing), run the following command:

```
npx @adobe/reactor-packager [options]
```

Npx will execute the packager tool using your locally linked code rather than the code published on the public npm repository.

To view the available options run the following command:

```
npx @adobe/reactor-packager --help
```
 
## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
