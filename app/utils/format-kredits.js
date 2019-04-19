import ethers from 'npm:ethers';

export default function(value, options = {}) {
  let etherValue = ethers.utils.formatEther(value);
  if (!options.decimals) {
    etherValue = parseInt(etherValue).toString();
  }
  return etherValue;
}
