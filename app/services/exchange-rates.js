import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'kredits-web/config/environment';

// Need to go through proxy for CORS headers
const bitstampBaseUrl = `${config.corsProxy}https://www.bitstamp.net/api/v2`;

async function fetchFromBitstamp(currencyPair) {
  try {
    const res = await fetch(`${bitstampBaseUrl}/ticker/${currencyPair}/`).then(r => r.json());
    return parseFloat(res.vwap); // Last 24 hours volume weighted average price
  } catch(e) {
    console.error('Could not fetch exchange rate from Bitstamp:', e);
    return 0;
  }
}

export default class ExchangeRatesService extends Service {
  @tracked btceur = 0;
  @tracked btcusd = 0;

  async fetchRates (source='bitstamp') {
    switch(source) {
      case 'bitstamp':
        this.btceur = await fetchFromBitstamp('btceur');
        this.btcusd = await fetchFromBitstamp('btcusd');
    }
  }
}
