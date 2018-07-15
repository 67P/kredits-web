import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | chart-contributions-by-type', function(hooks) {
  setupRenderingTest(hooks);

  let proposals = [
    { kind: 'dev', amount: 500 },
    { kind: 'dev', amount: 1500 },
    { kind: 'ops', amount: 1500 },
    { kind: 'design', amount: 5000 },
    { kind: 'ops', amount: 1500 },
    { kind: 'dev', amount: 5000 },
    { kind: 'community', amount: 5000 },
    { kind: 'docs', amount: 500 },
    { kind: 'docs', amount: 500 },
    { kind: 'docs', amount: 500 },
  ];

  test('it renders', async function(assert) {
    this.set('proposals', proposals);

    await render(hbs`{{chart-contributions-by-type contributions=proposals}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});
