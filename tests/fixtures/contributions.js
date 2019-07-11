import Model from 'kredits-web/models/contribution';
import contributors from '../../tests/fixtures/contributors';

const items = [];

const data = [
  { id: 1, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500, kind: 'dev' },
  { id: 2, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 5000, kind: 'ops' },
  { id: 3, contributorId: 2, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500, kind: 'ops' },
  { id: 4, contributorId: 2, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 1500, kind: 'docs' },
  { id: 5, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: false, amount: 5000, kind: 'design' },
  { id: 6, contributorId: 1, confirmedAtBlock: 1000, claimed: false, vetoed: true, amount: 500, kind: 'dev' },
  { id: 7, contributorId: 3, confirmedAtBlock: 2000, claimed: false, vetoed: false, amount: 5000, kind: 'dev' },
  { id: 8, contributorId: 1, confirmedAtBlock: 2000, claimed: false, vetoed: false, amount: 1500, kind: 'community' },
  { id: 9, contributorId: 3, confirmedAtBlock: 2000, claimed: false, vetoed: true, amount: 1500, kind: 'docs' },
];

data.forEach(attrs => {
  attrs.contributor = contributors.findBy('id', attrs.contributorId.toString());
  items.push(Model.create(attrs))
});

export default items;
