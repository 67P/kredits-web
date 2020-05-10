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

  avatarURL: computed('contributor.github_uid', 'size', function() {
    const github_uid = this.contributor.github_uid;

    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=${SIZES[this.size]}`;
    } else {
      // TODO use custom avatar
      return '';
    }
  })

});
