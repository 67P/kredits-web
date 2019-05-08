import Model from 'kredits-web/models/contribution';

const items = [];

const data = [
  { id: 1, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500 },
  { id: 2, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 5000 },
  { id: 3, contributorId: 2, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500 },
  { id: 4, contributorId: 2, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500 },
  { id: 5, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 5000 },
  { id: 6, contributorId: 3, confirmedAtBlock: 2000, claimed: false, vetoed: false, amount: 5000 },
  { id: 7, contributorId: 1, confirmedAtBlock: 2000, claimed: false, vetoed: false, amount: 1500 },
  { id: 8, contributorId: 3, confirmedAtBlock: 2000, claimed: false, vetoed: true, amount: 1500 },
];

data.forEach(attrs => items.push(Model.create(attrs)));

export default items;
