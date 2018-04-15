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

    return this.ipfs._ipfsAPI.id().catch((error) => {
      throw new Error(`IPFS node not available; config: ${JSON.stringify(ipfsConfig)} - ${error.message}`);
    }).then(() => {

      let registryContract = this.initRegistryContract(provider);

      let addresses = Object.keys(contracts).reduce((mem, name) => {
        let contractName = capitalize(name);
        mem[contractName] = registryContract.functions.getProxyFor(contractName).catch((error) => {
          throw new Error(`Failed to get address for ${contractName} from registry at ${registryContract.address}
            - correct registry? does it have version entry? - ${error.message}`
          );
        });
        return mem;
      }, {});

      return RSVP.hash(addresses)
        .then((addresses) => {
          return new Kredits(provider, signer, addresses);
        });
    });
  }

  static initRegistryContract(provider) {
    let address = addresses['Registry'][provider.chainId];
    if (!address) {
      throw new Error(`Registry address not found; invalid network?
        requested network: ${provider.chainId}
        supported networks: ${Object.keys(addresses['Registry'])}
      `);
    }
    provider.getCode(address).then((code) => {
      // not sure if we always get the same return value of the code is not available
      // that's why checking if it is < 5 long
      if (code === '0x00' || code.length < 5) {
        throw new Error(`Registry not found at ${address} on network ${provider.chainId}`);
      }
    });
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
    if (!address || !abis[contractName]) {
      throw new Error(`Address or ABI not found for ${contractName}`);
    }
    let contract = new ethers.Contract(address, abis[contractName], this.signer);
    this.contracts[name] = new contracts[contractName](contract);

    return this.contracts[name];
  }
}
