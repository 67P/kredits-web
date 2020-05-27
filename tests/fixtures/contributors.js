import Contributor from 'kredits-web/models/contributor';

const contributors = [];

const data = [
  { id: '1', name: 'Bumi', totalKreditsEarned: 11500, github_uid: 318 },
  { id: '2', name: 'Râu Cao', totalKreditsEarned: 3000, github_uid: 842 },
  { id: '3', name: 'Manuel', totalKreditsEarned: 0, github_uid: 54812 }
];

data.forEach(attrs => contributors.push(Contributor.create(attrs)));

export default contributors;
