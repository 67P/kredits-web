import Ember from 'ember';
import computed from 'ember-computed';
import injectService from 'ember-service/inject';

const {
  isPresent,
} = Ember;

export default Ember.Object.extend({
  ipfs: injectService(),

  id: null,
  address: null,
  name: null,
  kind: null,
  url: null,
  github_username: null,
  github_uid: null,
  wiki_username: null,
  profileHash: null,
  balance: null,
  isCore: false,
  isCurrentUser: false,

  avatarURL: computed('github_uid', function() {
    let github_uid = this.get('github_uid');
    if (github_uid) {
      return `https://avatars2.githubusercontent.com/u/${github_uid}?v=3&s=128`;
    }
  }),

  /**
   * Loads the contributor's profile data from IPFS and sets local instance
   * properties from it
   *
   * @method
   * @public
   */
  loadProfile() {
    let profileHash = this.get('profileHash');
    if (!profileHash) {
      return;
    }

    return this.get('ipfs')
      .getFile(profileHash)
      .then((content) => {
        let profile = Ember.Object.create(JSON.parse(content));
        this.set('ipfsData', JSON.stringify(profile, null, 2));

        Ember.Logger.debug('[contributor] loaded contributor profile', profile);

        this.setProperties({
          name: profile.get('name'),
          kind: profile.get('kind')
        });

        let accounts = profile.get('accounts');
        let github   = accounts.findBy('site', 'github.com');
        let wiki     = accounts.findBy('site', 'wiki.kosmos.org');

        if (isPresent(github)) {
          this.setProperties({
            github_username: github.username,
            github_uid: github.uid,
          });
        }
        if (isPresent(wiki)) {
          this.setProperties({
            wiki_username: wiki.username
          });
        }
      }).catch((err) => {
        Ember.Logger.error('[contributor] error trying to load contributor profile', profileHash, err);
      });
  },

  /**
   * Creates a JSON-LD object of the contributor, according to
   * https://github.com/67P/kosmos-schemas/blob/master/schemas/contributor.json
   *
   * @method
   * @public
   */
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

  /**
   * Returns the JSON-LD representation of the model as a string
   *
   * @method
   * @public
   */
  serialize() {
    return JSON.stringify(this.toJSON());
  }

});
