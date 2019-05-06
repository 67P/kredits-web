import Contributor from 'kredits-web/models/contributor';

const contributors = [];

const data = [
  { id: 1, name: 'Bumi', totalKreditsEarned: 11500 },
  { id: 2, name: 'Râu Cao', totalKreditsEarned: 3000 },
  { id: 3, name: 'Manuel', totalKreditsEarned: 0 }
];

data.forEach(attrs => contributors.push(Contributor.create(attrs)));

export default contributors;
