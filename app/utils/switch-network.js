import config from 'kredits-web/config/environment';

export default async function () {
  const networkName = config.web3NetworkName;
  const chainId     = config.web3ChainId;
  const chainIdHex  = `0x${Number(chainId).toString(16)}`;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }]
    });
  } catch (err) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: networkName,
          rpcUrls: [ config.web3ProviderUrl ],
          nativeCurrency: { name: 'tRBTC', symbol: 'tRBTC', decimals: 18 }
        }]
      });
    } else {
      console.warn('Failed to switch chains:', err.message);
    }
  }
}
