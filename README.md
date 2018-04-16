[![Build Status](https://travis-ci.org/67P/kredits-web.svg?branch=master)](https://travis-ci.org/67P/kredits-web)

# kredits-web

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone git@github.com:67P/kredits-web.git` this repository
* `cd kredits-web`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

See [working with locally deployed contracts](https://github.com/67P/kredits-web#working-with-locally-deployed-contracts) for details on how to develop with locally deployed contracts.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

_(You need collaborator permissions on the 5apps Deploy project.)_

`npm run deploy`

## Working with locally deployed contracts

The smart contracts and their JavaScript wrapper library are developed in the
[truffle-kredits](https://github.com/67P/truffle-kredits) repo/package.

You can run `kredits-web` on your machine, against a local, simulated Ethereum
network, provided e.g. by [ganache](http://truffleframework.com/ganache/) or
[ganache-cli](https://github.com/trufflesuite/ganache-cli).

[truffle-kredits](https://github.com/67P/truffle-kredits) holds all the tools
to start and set up such a simulated network, as well as to deploy smart
contracts to it.

These are the basic steps to get up and running:

#### 1. IPFS

Run a local IPFS deamon in offline mode.

  * Make sure CORS headers are configured. See [IPFS](#ipfs) for more info.
  * `ipfs daemon --offline`

#### 2. truffle-kredits

Get your local Ethereum development node running.

  * Clone [truffle-kredits](https://github.com/67P/truffle-kredits)
  * `npm install`
  * `npm run ganache` - which is basically: `ganache-cli -p 7545 -i 100` (we use the non-default port for local networks and a fixed network id)
  * `npm run bootstrap` - bootstrap runs fresh migrations, adds some seed data and writes the address/abi information to JSON that will be used by kredits-web
  * `npm link` - make the `truffle-kredits` module linkable as `kredits-contracts` on your machine

#### 3. kredits-web

With IPFS and Ethereum/ganache running, you can now start this Ember app.

  * `npm link kredits-contracts` - link the local `truffle-kredits` package (it will become `kredits-contracts` soon)
  * `npm start`

#### IPFS

Install IPFS with your favorite package manager and run

    ipfs init (on initial installation)
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["localhost:4200"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
