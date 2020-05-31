import Contributor from 'kredits-web/models/contributor';
import processContributorData from 'kredits-web/utils/process-contributor-data';

const contributors = [];

const data = [
  { id: '1', name: 'Bumi', totalKreditsEarned: 11500, github_uid: 318 },
  { id: '2', name: 'Râu Cao', totalKreditsEarned: 3000, github_uid: 842 },
  { id: '3', name: 'Manuel', totalKreditsEarned: 0, github_uid: 54812 }
];

data.forEach(attrs => {
  const c = Contributor.create(processContributorData(attrs));
  contributors.push(c);
});

export default contributors;
