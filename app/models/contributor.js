import Ember from 'ember';

export default Ember.Object.extend({

  address: null,
  name: null,
  kind: null,
  url: null,
  github_username: null,
  github_uid: null,
  wiki_username: null,
  ipfsHash: null,
  kredits: null,
  isCore: false,
  isCurrentUser: false,

  avatarURL: function() {
    return `https\:\/\/avatars2.githubusercontent.com/u/${this.get('github_uid')}?v=3&s=128`;
  }.property('github_uid'),

  toJSON() {
    let contributor = {
      "@context": "https://schema.kosmos.org",
      "@type": "Contributor",
      "kind": this.get('kind'),
      "name": this.get('name'),
      "accounts": []
    };

    if (Ember.isPresent(this.get('url'))) {
      contributor["url"] = this.get('url');
    }
    if (Ember.isPresent(this.get('github_uid'))) {
      contributor.accounts.push({
        "site": "github.com",
        "uid": this.get('github_uid'),
        "username": this.get('github_username'),
        "url": `https://github.com/${this.get('github_username')}`
      });
    }
    if (Ember.isPresent(this.get('wiki_username'))) {
      contributor.accounts.push({
        "site": "wiki.kosmos.org",
        "username": this.get('wiki_username'),
        "url": `https://wiki.kosmos.org/User:${this.get('wiki_username')}`
      });
    }

    return contributor;
  },

  serialize() {
    return JSON.stringify(this.toJSON());
  }

});
