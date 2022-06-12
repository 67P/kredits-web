export default function processContributorData(data) {
  const processed = {
    balance: data.balanceInt,
    totalKreditsEarned: data.totalKreditsEarned,
    contributionsCount: data.contributionsCount?.toNumber()
  }

  const otherProperties = [
    'id', 'account', 'accounts', 'ipfsHash', 'isCore', 'kind', 'name', 'url',
    'github_username', 'github_uid', 'wiki_username', 'zoom_display_name'
  ];

  otherProperties.forEach(prop => {
    processed[prop] = data[prop];
  });

  return processed;
}
