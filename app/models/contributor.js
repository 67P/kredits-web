import Ember from 'ember';

export default Ember.Object.extend({

  address: null,
  github_username: null,
  github_uid: null,
  ipfsHash: null,
  kredits: null,
  isCurrentUser: false,

  avatarURL: function() {
    return `https\:\/\/avatars2.githubusercontent.com/u/${this.get('github_uid')}?v=3&s=128`;
  }.property('github_uid')

});
