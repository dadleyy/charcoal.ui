/*jshint node:true*/
/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  const sassOptions = {
    extension    : 'sass',
    includePaths : [
      './bower_components/bases.scss/src'
    ]
  };

  const config = {
    sassOptions,
    "ember-cli-babel": {
      includePolyfill: true
    }
  };

  const app    = new EmberApp(defaults, config);

  return app.toTree();
};
