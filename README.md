[![Build Status](https://travis-ci.org/67P/kredits-web.svg?branch=master)](https://travis-ci.org/67P/kredits-web)

# kredits-web

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:67P/kredits-web.git` this repository
* `cd kredits-web`
* `npm install`

## Running / Development


* `ember serve` - by default kredits-web connects to the Ethreum Kovan network
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

See [working with locally deployed contracts](https://github.com/67P/kredits-web#working-with-locally-deployed-contracts) for details on how to develop with locally deployed contracts.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

_(You need collaborator permissions on the 5apps Deploy project.)_

`npm run deploy`

## Working with locally deployed contracts

The smart contracts and their JavaScript wrapper library are developed in the
[kredits-contracts](https://github.com/67P/kredits-contracts) repo/package.

You can run `kredits-web` on your machine, against a local, simulated Ethereum
network, provided e.g. by [ganache](http://truffleframework.com/ganache/) or
[ganache-cli](https://github.com/trufflesuite/ganache-cli).

[kredits-contracts](https://github.com/67P/kredits-contracts) holds all the tools
to start and set up such a simulated network, as well as to deploy smart
contracts to it.

These are the basic steps to get up and running:

#### 1. IPFS

Run a local IPFS deamon in offline mode.

  * Make sure CORS headers are configured. See [IPFS](#ipfs) for more info.
  * `ipfs daemon --offline`

#### 2. kredits-contracts

Get your local Ethereum development node running. (See [kredits-contracts README](https://github.com/67P/kredits-contracts) 
for details.

  * Clone [kredits-contracts](https://github.com/67P/kredits-contracts)
  * `npm install`
  * `npm run devchain` - runs a local development chain
  * `npm run bootstrap` - bootstrap runs deploys all the contracts 
  * `npm link` - make the `kredits-contracts` module linkable as `kredits-contracts` on your machine (currently broken :()

#### 3. kredits-web

With IPFS and Ethereum/ganache running, you can now start this Ember app.

  * `npm link kredits-contracts` - link the local `kredits-contracts` package
  * `npm run start:local` - WEB3_PROVIDER_URL=http://localhost:7545 must be set for local settings

If you restart the devchain your network ID changes. So kredits-contracts does not find the correct DAO Kernel address. 
If that is the case the DAO address must be provided as `KREDITS_KERNEL_ADDRESS` environment variable.

    * `KREDITS_KERNEL_ADDRESS=<0xYOURADDRESS> npm run start:local` - find your address with the `npm run dao:address` command in the kredits-contracts repo.

#### IPFS

Install IPFS with your favorite package manager and run

    ipfs init (on initial installation)
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["localhost:4200"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
