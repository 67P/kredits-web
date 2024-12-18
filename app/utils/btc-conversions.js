export function floatToBtc(number) {
  return Number(number.toFixed(8))
}

export function btcToSats(btc) {
  return Math.round(btc * 100_000_000);
}

export function satsToBtc(sats) {
  return Math.round((sats / 100_000_000) * 100_000_000) / 100_000_000;
}
