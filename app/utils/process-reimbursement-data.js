export default function processReimbursementData(data) {
  const processed = {}

  if (data.confirmedAtBlock && (typeof data.confirmedAtBlock.toNumber === 'function')) {
    processed.confirmedAt = data.confirmedAtBlock.toNumber();
  } else if (data.confirmedAt !== 'undefined') {
    processed.confirmedAt = data.confirmedAt;
  }

  const otherProperties = [
    'id', 'contributorId', 'token', 'amount', 'vetoed', 'ipfsHash',
    'expenses', 'pendingTx'
  ];

  otherProperties.forEach(prop => {
    processed[prop] = data[prop];
  });

  return processed;
}
