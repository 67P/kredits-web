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
      tests: true,
      transform: [
        ["babelify", {
          presets: ["es2015"],
          global: true
        }]
      ]
    },

    contractMetadata: {},

    web3ProviderUrl: 'https://parity.kosmos.org:8545',

    ipfs: {
      host: 'ipfs.kosmos.org',
      port: '5444',
      protocol: 'http'
    }
  };

  if (process.env.KREDITS_CONTRACT_ADDR) {
    ENV.contractMetadata['Kredits'] = { address: process.env.KREDITS_CONTRACT_ADDR };
  }
  if (process.env.TOKEN_CONTRACT_ADDR) {
    ENV.contractMetadata['Token'] = { address: process.env.TOKEN_CONTRACT_ADDR };
  }
  if (process.env.WEB3_PROVIDER_URL) {
    ENV.web3ProviderUrl = process.env.WEB3_PROVIDER_URL;
  }
  ENV.contractMetadata['networkId'] = "17";

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
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
  }

  if (environment === 'production') {
  }

  return ENV;
};
