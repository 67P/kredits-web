import Ember from 'ember';

export default Ember.Object.extend({

  address: null,
  github_username: null,
  github_uid: null,
  ipfsHash: null,
  kredits: null,
  isCore: false,
  isCurrentUser: false,

  avatarURL: function() {
    return `https\:\/\/avatars2.githubusercontent.com/u/${this.get('github_uid')}?v=3&s=128`;
  }.property('github_uid'),

  serialize() {
    return JSON.stringify({
      profiles: {
        'github.com': {
          uid: this.get('github_uid'),
          username: this.get('github_username'),
        }
        // 'wiki.kosmos.org': {
        //   username: this.get('wiki_username')
        // }
      }
    });
  }

});
