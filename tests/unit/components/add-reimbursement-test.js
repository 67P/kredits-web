import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createComponent from 'kredits-web/tests/helpers/create-component';

const expenses = [
  {
    title: "Server rent",
    description: "Dedicated server: andromeda.kosmos.org, April 2020",
    currency: "EUR",
    amount: 39.00,
    date: "2020-05-06",
    url: "https://wiki.kosmos.org/Infrastructure#Hetzner",
    tags: ["infrastructure", "server", "hetzner"]
  },
  {
    title: "Server rent",
    description: "Dedicated server: centaurus.kosmos.org, April 2020",
    currency: "EUR",
    amount: 32.00,
    date: "2020-05-06",
    url: "https://wiki.kosmos.org/Infrastructure#Hetzner",
    tags: ["infrastructure", "server", "hetzner"]
  },
  {
    title: "Domain name kosmos.org",
    currency: "USD",
    amount: 59.00,
    date: "2020-05-07",
    tags: ["domain"]
  }
];

module('Unit | Component | add-reimbursement', function(hooks) {
  setupTest(hooks);

  test('total sums of expenses in EUR and USD', function(assert) {
    let component = createComponent('component:add-reimbursement');
    component.expenses = expenses;
    assert.equal(component.totalEUR, '71');
    assert.equal(component.totalUSD, '59');
  });

  test('#updateTotalAmountFromFiat', async function(assert) {
    let component = createComponent('component:add-reimbursement');
    component.expenses = expenses;
    await component.exchangeRates.fetchRates();
    component.updateTotalAmountFromFiat();
    assert.equal(component.total, '0.01323322', 'converts EUR and USD totals to BTC and rounds to 8 decimals');
  });
});
