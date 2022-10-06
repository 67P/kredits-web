'use strict';

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    },
    babelOptions: {
      babelrc: false,
      configFile: false,
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
      ],
    },
  },
  globals: {
    console: true
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'ember/avoid-leaking-state-in-ember-objects': 'warn',
    'no-console': 'off',
    'ember/no-jquery': 'error',
    'ember/require-computed-property-dependencies': 'warn',
    'ember/no-computed-properties-in-native-classes': 'warn',
    'ember/no-observers': 'warn',
    'ember/no-classic-classes': 'warn',
    'ember/no-classic-components': 'warn',
    'ember/no-controller-access-in-routes': 'warn',
    'ember/no-actions-hash': 'warn',
    'ember/require-tagless-components': 'warn'
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js',
        'server/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here

        // this can be removed once the following is fixed
        // https://github.com/mysticatea/eslint-plugin-node/issues/77
        'node/no-unpublished-require': 'off'
      })
    }
  ]
};
