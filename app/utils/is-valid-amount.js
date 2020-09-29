export default function isValidAmount(inputAmount) {
  const amount = parseFloat(inputAmount);
  if (Number.isNaN(amount)) {
    return false;
  } else {
    return amount > 0;
  }
}
