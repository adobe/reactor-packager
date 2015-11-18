# turbine-gulp-packager

This project provides gulp tasks for packaging an extension.

In order to have the packaging functionality inside your extension, add turbine-gulp-packager to the `devDependencies` of your project's `package.json` and `npm install` it. In your `gulpfile.js`, require the builder and pass in your gulp instance as follows:

```javascript
var gulp = require('gulp');
require('turbine-gulp-packager')(gulp);

## Building

To build the `package.zip` file, run `gulp package` from the command line within your project's directory.

```
## Preprocessing extension views

It may be that your extension views require some preprocessing. Maybe your views use JSX, Stylus, or some other tech that needs preprocessing before they can be displayed within the sandbox. To handle these cases, create a gulp task that performs the preprocessing and pass the name of that task to turbine-gulp-packager as follows:

```javacript
var gulp = require('gulp');

gulp.task('buildView', function() {
  // Process your view here.
});

require('turbine-gulp-sandbox')(gulp, {
  buildViewTask: 'buildView'
});
```

By doing so, your task will also be run when running `gulp package`.

## Cleaning

If you ever want to remove the `package.zip` file from your project you can run `gulp package:clean`.
