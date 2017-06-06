import { moduleFor, test } from 'ember-qunit';
import schemas from 'npm:kosmos-schemas';
import tv4 from 'npm:tv4';

moduleFor('model:proposal', 'Unit | Model | proposal');

test('#toJSON() requires a recipient profile IPFS hash to be set', function(assert) {
  let model = this.subject();

  model.setProperties({
    recipientAddress: '0xd4a64570b12da659ee4bbd41c3509b7b1f9c51ac'
  });

  try {
    let json = model.contributionToJSON();
    assert.notOk(json, true);
  } catch(e) {
    assert.ok(e.message.match(/IPFS hash .* missing/i));
  }
});

test('#toJSON() requires kind and description to be set', function(assert) {
  let model = this.subject();

  model.setProperties({
    recipientProfile: 'QmT2A7rY4e7uoKktkcFHQNN7BD1oXdZTgd8wNkr1u9nNVE'
  });

  try {
    let json = model.contributionToJSON();
    assert.notOk(json, true);
  } catch(e) {
    assert.ok(e.message.match(/Missing .* kind.*description/i));
  }
});

test('#toJSON() returns a valid JSON-LD representation of the model', function(assert) {
  let model = this.subject();

  model.setProperties({
    recipientAddress: '0xd4a64570b12da659ee4bbd41c3509b7b1f9c51ac',
    kind: 'design',
    description: 'New logo design',
    url: 'http://opensourcedesign.org',
    recipientProfile: 'QmT2A7rY4e7uoKktkcFHQNN7BD1oXdZTgd8wNkr1u9nNVE'
  });

  assert.ok(tv4.validate(model.contributionToJSON(), schemas['contribution']));
});
