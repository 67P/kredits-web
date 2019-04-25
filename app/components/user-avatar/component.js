import Component from '@ember/component';
import { alias } from '@ember/object/computed';

export default Component.extend({
  contributor: null,
  tagName: 'img',
  classNames: ['avatar'],
  attributeBindings: ['src', 'title'],
  src: alias('contributor.avatarURL'),
  title: alias('contributor.name')
});
