var path = require('path');
var glob = require('glob');

module.exports = function(gulp, options) {
  options = options || {};

  // Require in each task.
  glob.sync(path.join(__dirname, 'tasks/*.js')).forEach(function(taskFile) {
    require(taskFile)(gulp, options);
  });
};
