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
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
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

    web3ProviderUrl: 'https://rinkeby.infura.io/v3/d4f788b7a6584f7db2fc3c268d4d09e9',
    web3RequiredNetwork: 'rinkeby',

    githubConnectUrl: 'https://hal8000.chat.kosmos.org/kredits/signup/connect/github',
    githubSignupUrl: 'https://hal8000.chat.kosmos.org/kredits/signup/github',

    ipfs: {
      host: 'ipfs.kosmos.org',
      port: '5444',
      protocol: 'https',
      gatewayUrl: 'https://ipfs.kosmos.org/ipfs'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.web3ProviderUrl = 'https://rinkeby.infura.io/v3/d4f788b7a6584f7db2fc3c268d4d09e9';

    ENV.githubConnectUrl = 'http://localhost:8888/kredits/signup/connect/github';
    ENV.githubSignupUrl = 'http://localhost:8888/kredits/signup/github';

    ENV.ipfs = {
      host: 'localhost',
      port: '5001',
      protocol: 'http',
      gatewayUrl: 'http://localhost:8080/ipfs'
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

  if (process.env.WEB3_PROVIDER_URL) {
    ENV.web3ProviderUrl = process.env.WEB3_PROVIDER_URL;
    ENV.web3RequiredNetwork = null;
  }
  if (process.env.KREDITS_DAO_ADDRESS) {
    ENV.kreditsKernelAddress = process.env.KREDITS_DAO_ADDRESS;
  }
  if (process.env.KREDITS_APM_DOMAIN) {
    ENV.kreditsApmDomain = process.env.KREDITS_APM_DOMAIN;
  }

  return ENV;
};
