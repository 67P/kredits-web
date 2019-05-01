import Contributor from 'kredits-web/models/contributor';

const contributors = [];

const data = [
  { id: 1, name: 'Bumi', totalKreditsEarned: 5500 },
  { id: 2, name: 'Râu Cao', totalKreditsEarned: 1500 },
  { id: 3, name: 'Manuel', totalKreditsEarned: 3000 }
];

data.forEach(attrs => contributors.push(Contributor.create(attrs)));

export default contributors;
