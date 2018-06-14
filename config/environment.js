/* jshint node: true */
'use strict';

module.exports = function(environment) {

  let ENV = {
    modulePrefix: 'kredits-web',
    environment,
    rootURL: '/',
    locationType: 'auto',

    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    browserify: {
      tests: true,
      transform: [
        ["babelify", {
          presets: ["es2015"],
          global: true
        }]
      ]
    },

    contractMetadata: { networkId: '42' },

    web3ProviderUrl: 'https://kovan.infura.io/keUVk6OMaAvpmRF3m57n',

    ipfs: {
      host: 'ipfs.kosmos.org',
      port: '5444',
      protocol: 'https'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.contractMetadata['networkId'] = '42';
    ENV.web3ProviderUrl = 'https://kovan.infura.io/keUVk6OMaAvpmRF3m57n';

    ENV.ipfs = {
      host: 'localhost',
      port: '5001',
      protocol: 'http'
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  if (process.env.NETWORK_ID) {
    ENV.contractMetadata['networkId'] = process.env.NETWORK_ID;
  }
  if (process.env.WEB3_PROVIDER_URL) {
    ENV.web3ProviderUrl = process.env.WEB3_PROVIDER_URL;
  }

  return ENV;
};
