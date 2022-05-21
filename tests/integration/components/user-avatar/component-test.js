import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import contributors from '../../../fixtures/contributors';

module('Integration | Component | user-avatar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('bumi', contributors.findBy('id', 1));
    await render(hbs`{{user-avatar contributor=bumi}}`);

    assert.dom(this.element).hasText('');
  });

  test('default image source URL', async function(assert) {
    this.set('bumi', contributors.findBy('id', 1));
    await render(hbs`{{user-avatar contributor=bumi}}`);

    assert.equal(this.element.querySelector('img').src,
                 `https://avatars2.githubusercontent.com/u/318?v=3&s=128`);
  });

  test('size-specific image source URLs', async function(assert) {
    this.set('bumi', contributors.findBy('id', 1));
    this.set('size', 'medium');

    await render(hbs`{{user-avatar contributor=bumi size=size}}`);

    assert.equal(this.element.querySelector('img').src,
                 `https://avatars2.githubusercontent.com/u/318?v=3&s=256`);

    this.set('size', 'large');

    assert.equal(this.element.querySelector('img').src,
                 `https://avatars2.githubusercontent.com/u/318?v=3&s=512`);
  });

});
