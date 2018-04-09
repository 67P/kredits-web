import ethers from 'npm:ethers';
import RSVP from 'rsvp';

import abis from 'contracts/abis';
import addresses from 'contracts/addresses';

import contracts from './contracts';
import IPFS from './utils/ipfs';

// Helpers
function capitalize(word) {
  let [first, ...rest] = word;
  return `${first.toUpperCase()}${rest.join('')}`;
}

export default class Kredits {
  constructor(provider, signer, addresses) {
    this.provider = provider;
    this.signer = signer;

    // Initialize our registry contract
    this.addresses = addresses;
    this.contracts = {};
  }

  static setup(provider, signer, ipfsConfig) {
    this.ipfsConfig = ipfsConfig;
    this.ipfs = new IPFS(ipfsConfig);

    let registryContract = this.initRegistryContract(provider);

    let addresses = Object.keys(contracts).reduce((mem, name) => {
      let contractName = capitalize(name);
      mem[contractName] = registryContract.functions.getProxyFor(contractName);
      return mem;
    }, {});

    return RSVP.hash(addresses)
      .then((addresses) => {
        return new Kredits(provider, signer, addresses);
      });
  }

  static initRegistryContract(provider) {
    let address = addresses['Registry'][provider.chainId];
    let abi = abis['Registry'];
    console.log('Initialize registry contract:', address, abi, provider);
    return new ethers.Contract(address, abi, provider);
  }

  get Contributor() {
    // TODO: rename to contributor
    return this.contractFor('contributors');
  }

  get Operator() {
    return this.contractFor('operator');
  }

  get Token() {
    return this.contractFor('token');
  }

  // Should be private
  contractFor(name) {
    if (this.contracts[name]) {
      return this.contracts[name];
    }

    let contractName = capitalize(name);
    let address = this.addresses[contractName];
    let contract = new ethers.Contract(address, abis[contractName], this.signer);
    this.contracts[name] = new contracts[contractName](contract);

    return this.contracts[name];
  }
}
