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

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.


## Working with locally deployed contracts

For development you should checkout [truffle-kredits](https://github.com/67P/truffle-kredits).
See the [README](https://github.com/67P/truffle-kredits/#readme) how to setup `truffle-kredits`.

Run the following commands in `truffle-kredits`
* `ganache-cli -p 7545`
* `truffle migrate`
* `npm link`

Run ipfs local
* `ipfs daemon --offline` See [IPFS](#ipfs) for the setup

In `kredits-web`
* `npm link kredits-contracts`
* `ember serve`

## IPFS

Install IPFS with your favorite package manager and run

    ipfs init
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["localhost:4200"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
    ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
