import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

const SIZES = {
  'small':  '128', // pixels
  'medium': '256',
  'large':  '512'
}

export default Component.extend({
  contributor: null,
  tagName: 'img',
  classNames: ['avatar'],
  classNameBindings: ['size'],
  attributeBindings: ['src', 'title'],
  size: 'small',

  src: alias('avatarURL'),
  title: alias('contributor.name'),

  // Re-compute whenever the contributor reference itself changes (covers a
  // previously-undefined contributor being lazily loaded later), as well as
  // the github_uid property when one is present.
  avatarURL: computed('contributor', 'contributor.github_uid', 'size', function() {
    const contributor = this.contributor;

    if (!contributor) {
      return '';
    }

    const github_uid = contributor.github_uid;

    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=${SIZES[this.size]}`;
    } else {
      // TODO use custom avatar
      return '';
    }
  })

});
