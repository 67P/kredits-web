export default function processContributionData(data, options={}) {
  const processed = {}

  if (data.confirmedAtBlock && (typeof data.confirmedAtBlock.toNumber === 'function')) {
    processed.confirmedAt = data.confirmedAtBlock.toNumber();
  } else if (data.confirmedAt !== 'undefined') {
    processed.confirmedAt = data.confirmedAt;
  }

  const otherProperties = [
    'id', 'contributorId', 'amount', 'vetoed', 'ipfsHash', 'kind',
    'description', 'url', 'date', 'time', 'pendingTx'
  ];

  otherProperties.forEach(prop => {
    processed[prop] = data[prop];
  });

  if (options.includeDetails) {
    processed.details = data.details;
  }

  return processed;
}
