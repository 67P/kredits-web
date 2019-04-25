import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({
  contributor: null,
  tagName: 'img',
  classNames: ['avatar'],
  attributeBindings: ['src'],
  src: alias('contributor.avatarURL')
});
