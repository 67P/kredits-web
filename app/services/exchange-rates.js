import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'kredits-web/config/environment';

// Need to go through proxy for CORS headers
const bitstampBaseUrl = `${config.corsProxy}https://www.bitstamp.net/api/v2`;
const kosmosBtcPriceBaseUrl = "https://storage.kosmos.org/kosmos/public/btc-price";

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
  @tracked EUR = 0;
  @tracked USD = 0;
  @tracked historic = {};

  get exchangeRatesLoaded () {
    return (this.EUR !== 0) && (this.USD !== 0);
  }

  async fetchRates (source='bitstamp') {
    if (this.exchangeRatesLoaded) return;

    switch(source) {
      case 'bitstamp':
        this.EUR = await fetchFromBitstamp('btceur');
        this.USD = await fetchFromBitstamp('btcusd');
    }
  }

  async fetchHistoricRates (isoDate) {
    if (typeof this.historic[isoDate] === "object") {
      return this.historic[isoDate];
    } else {
      const url = `${kosmosBtcPriceBaseUrl}/${isoDate}`;
      try {
        const rates = await fetch(url).then(res => res.json());
        this.historic[isoDate] = rates;
        return rates;
      } catch(e) {
        console.error(e);
        Promise.reject(e);
      }
    }
  }
}
