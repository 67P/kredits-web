import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'ul',
  classNames: ['contribution-list'],

  contributionsWithContributors: function() {
    return this.get('contributions').map((c) => {
      c.set('contributor', this.get('contributors')
                               .findBy('address', c.get('recipientAddress')));
      return c;
    });
  }.property('contributions.@each')

});
