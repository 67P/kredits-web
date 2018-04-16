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

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

See [working with locally deployed contracts](https://github.com/67P/kredits-web#working-with-locally-deployed-contracts) for details on how to develop with locally deployed contracts.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.


## Working with locally deployed contracts

For development you should checkout [truffle-kredits](https://github.com/67P/truffle-kredits).
See the [README](https://github.com/67P/truffle-kredits/#readme) how to setup `truffle-kredits`.

### Basic idea:

To run the app locally with a locally deployed contract most likely in a ethereum simulator like [ganache](http://truffleframework.com/ganache/) or [ganache-cli](https://github.com/trufflesuite/ganache-cli)  
[truffle-kredits](https://github.com/67P/truffle-kredits) holds all the tools to start and setup that local simulation network (and generally to deply the contracts)

Get familiar with truffle and truffle-kredits, but these are the basic steps to get up and running: 

1. truffle-kredits (get the local ethereum node running)
  * setup (clone and npm install) truffle-kredits
  * `npm run ganache` - which is basically: `ganache-cli -p 7545 -i 100` (we use the non-default port for local networks and a fixed network id)
  * `npm run bootstrap` - bootstrap runs fresh migrations, adds some seed data and writes the address/abi information to JSON that will be used by kredits-web
  * `npm link` - link the truffle-kredits dependency to kredits-web

2. IPFS (run a local ipfs deamon in offline mode)
  * make sure the ipfs cors header are configured - See [IPFS](#ipfs) for more configurations 
  * `ipfs daemon --offline` 

3. kredits-web
  * `npm link kredits-contracts` - link the local truffle-kredits package (attention: the naming! we need to make the new truffle-kredits the official kredits-contracts package)
  * `ember serve` 

## IPFS

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
