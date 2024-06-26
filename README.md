[![Build Status](https://github.com/67P/kredits-web/actions/workflows/ci.yml/badge.svg)](https://github.com/67P/kredits-web/actions/workflows/ci.yml?query=branch%3Amaster)

# Kredits Web

This is the main Web UI for Kosmos [Kredits](https://wiki.kosmos.org/Kredits).
It provides an overview of contributors and contributions, as well as the
community's budget, expenses, and reimbursements.

It is an unhosted Web app, fetching all data from
[Rootstock](https://rootstock.io/) and [IPFS](https://ipfs.tech/), and caching
it in the browser's local database. As such, you can run the app directly from
the `/release` directory on any Web server that can serve static assets.

## Development

### Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/) (only for running tests)

### Installation

* `git clone git@github.com:67P/kredits-web.git` this repository
* `cd kredits-web`
* `npm install`

### Building/running for development

* `npm start` - by default Kredits Web connects to the Rootstock testnet network
* Visit the app at [http://localhost:4200](http://localhost:4200).
* Visit the tests at [http://localhost:4200/tests](http://localhost:4200/tests).

See [working with locally deployed contracts](https://github.com/67P/kredits-web#working-with-locally-deployed-contracts) for details on how to develop with locally deployed contracts.

### Code generators

Make use of the many generators for code, try `ember help generate` for more details

### Running tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `npm run build` (production)

### Deploying

_(You need collaborator permissions on the 5apps Deploy project.)_

`npm run deploy`

### Working with locally deployed contracts

The smart contracts and their JavaScript wrapper library are developed in the
[kredits-contracts](https://github.com/67P/kredits-contracts) repo/package.

You can run `kredits-web` on your machine, against a local, simulated
blockchain. [kredits-contracts](https://github.com/67P/kredits-contracts)
contains all the tools to start and set up such a simulated network, as well as
to deploy the Kredits smart contracts to it.

These are the basic steps to get up and running:

#### 1. IPFS

Run a local IPFS deamon.

  * Make sure CORS headers are configured. See [IPFS](#ipfs) for more info.
  * `ipfs daemon`

#### 2. kredits-contracts

Run a local devchain with test data. (See [kredits-contracts
README](https://github.com/67P/kredits-contracts) for details.

  * Clone [kredits-contracts](https://github.com/67P/kredits-contracts)
  * `npm install`
  * `npm run devchain` - runs a local development chain
  * `npm run bootstrap` - deploys all contracts and seeds test data
  * `npm link` - makes the `kredits-contracts` module linkable as `kredits-contracts` on your machine

#### 3. kredits-web

With IPFS and the local devchain running, you can now link the contracts and
start the Ember app:

  * `npm link kredits-contracts` - links the local `kredits-contracts` package (has to be done again after every `npm install`)
  * `npm run start:local` - runs the Ember app with WEB3_PROVIDER_URL=http://localhost:8545 set

#### 4. Metamask network

If you want to interact with the local contracts via a Web3 wallet, switch the
network to a "Custom RPC" one, with the RPC URL `http://localhost:8545`.

#### IPFS

If you haven't configured your IPFS node for CORS yet, you can do so by running
the following commands:

    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["localhost:4200"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
    ipfs config Addresses.Gateway /ip4/127.0.0.1/tcp/8080

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
