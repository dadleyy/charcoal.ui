/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var sassOptions = {
    extension    : 'sass',
    includePaths : [
      './bower_components/bases.scss/src'
    ]
  };

  var config = { sassOptions };
  var app    = new EmberApp(defaults, config);

  return app.toTree();
};
