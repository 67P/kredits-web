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

    web3ProviderUrl: 'https://rsk-testnet.kosmos.org',
    web3ChainId: 31,
    web3NetworkName: 'RSK Testnet',

    githubConnectUrl: 'https://hal8000.kosmos.chat/kredits/signup/connect/github',
    githubSignupUrl: 'https://hal8000.kosmos.chat/kredits/signup/github',

    ipfs: {
      host: 'ipfs.kosmos.org',
      port: '5444',
      protocol: 'https',
      gatewayUrl: 'https://ipfs.kosmos.org/ipfs'
    },

    tokens: {
      // TODO this is still the WBTC address, since contracts currently
      // requires a token address for reimbursements
      'BTC': '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    },

    communityFundsAPI: {
      balances: {
        onchain: {
          icon: 'icon-btc.png',
          symbol: 'BTC',
          description: 'BTC on chain',
          url: 'https://api.kosmos.org/btcpay/onchain_btc_balance'
        },
        lightning: {
          icon: 'icon-btc-lightning.png',
          symbol: 'BTC',
          description: 'BTC on Lightning Network',
          url: 'https://api.kosmos.org/btcpay/lightning_btc_balance'
        }
      }
    },

    corsProxy: 'https://cors.5apps.com/?uri=',

    hideVetoedEntriesAfterBlocks: 5760 // 48 hours
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.githubConnectUrl = 'http://localhost:8888/kredits/signup/connect/github';
    ENV.githubSignupUrl = 'http://localhost:8888/kredits/signup/github';

    ENV.ipfs = {
      host: 'localhost',
      port: '5001',
      protocol: 'http',
      gatewayUrl: 'http://localhost:8080/ipfs'
    };

    // Uncomment if you want to use local akkounts
    // ENV.communityFundsAPI.balances.onchain.url   = 'http://localhost:3000/api/btcpay/onchain_btc_balance';
    // ENV.communityFundsAPI.balances.lightning.url = 'http://localhost:3000/api/btcpay/lightning_btc_balance';
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
  }
  if (process.env.WEB3_CHAIN_ID) {
    ENV.web3ChainId = parseInt(process.env.WEB3_CHAIN_ID);
  }
  if (process.env.WEB3_NETWORK_NAME) {
    ENV.web3NetworkName = process.env.WEB3_NETWORK_NAME;
  }

  return ENV;
};
