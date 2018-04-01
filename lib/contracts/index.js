/*jshint node:true*/
const writeFile = require('broccoli-file-creator');
const mergeTrees = require('broccoli-merge-trees');
const jsonModule = require('broccoli-json-module');

module.exports = {
  name: 'contracts',

  treeForAddon: function(tree) {
    let trees = [];
    const files = require('kredits-contracts/lib');

    let abis = {};
    let addresses = {};

    files.forEach(function(file) {
      abis[file] = require(`kredits-contracts/lib/abis/${file}.json`);
      addresses[file] = require(`kredits-contracts/lib/addresses/${file}.json`);
    });

    trees.push(writeFile(`abis/index.json`, JSON.stringify(abis)));
    trees.push(writeFile(`addresses/index.json`, JSON.stringify(addresses)));

    tree = jsonModule(mergeTrees(trees));

    return this._super.treeForAddon.call(this, tree);
  },

  isDevelopingAddon: function() {
    return true;
  }
};
