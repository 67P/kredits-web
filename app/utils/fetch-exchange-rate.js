const bitstampBaseUrl = 'https://www.bitstamp.net/api/v2';

async function fetchFromBitstamp(currencyPair) {
  try {
    const res = await fetch(`${bitstampBaseUrl}/ticker/${currencyPair}/`).then(r => r.json());
    return res.vwap; // Last 24 hours volume weighted average price
  } catch(e) {
    console.error('Could not fetch exchange rate from Bitstamp:', e);
    return 0;
  }
}

export default function fetchExchangeRate(currencyPair, source='bitstamp') {
  if (!currencyPair) throw 'Currency pair required';

  switch(source) {
    case 'bitstamp':
      return fetchFromBitstamp(currencyPair);
  }
}
