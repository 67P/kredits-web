/* jshint node: true */
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'kredits-web',
    environment: environment,
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
      transform: [
        ["babelify", {
          presets: ["es2015"],
          global: true
        }]
      ]
    },

    web3ProviderUrl: "https://parity.kosmos.org:8545",
    ethereumChain: "testnet",
    ipfs: {
      host: 'localhost',
      port: '5001',
      protocol: 'http'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.ethereumChain = 'dev';
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.ethereumChain = 'testnet';
    ENV.web3ProviderUrl = 'https://ropsten.infura.io';
  }

  return ENV;
};
