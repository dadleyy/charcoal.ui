/* jshint node: true */
const dotenv = require("dotenv");
const pkg = require('../package.json');

dotenv.load("../.env");

module.exports = function(environment) {
  var ENV = {
    author          : pkg.author && pkg.author.name ? pkg.author.name : pkg.author,
    source_home     : pkg.homepage,
    modulePrefix    : 'charcoal',
    podModulePrefix : 'charcoal/pods',
    environment     : environment,
    rootURL         : '/',
    locationType    : 'auto',

    google: { 
      tracking_id: process.env["GOOGLE_TRACKING_ID"],
    },

    EmberENV: {
      FEATURES: {
      },
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },

    APP: {
    }
  };

  ENV.i18n = {
    defaultLocale: "en"
  };

  if (environment === 'development') {
    ENV.API_HOME = '/api';
    ENV.LOCALE_HOME = '/locale'
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    ENV.locationType = 'none';
    ENV.LOCALE_HOME = '/locale'
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.LOCALE_HOME = '/locale'
    ENV.API_HOME = '/api';
  }

  return ENV;
};
