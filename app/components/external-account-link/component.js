import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: "",
  account: null,

  iconComponentName: computed('account.site', function() {
    if (this.account.site.match(/github|gitea|wiki/)) {
      return 'icon-account-' + this.account.site.replace(/\./g, '-');
    } else {
      return 'icon-web-globe';
    }
  })
});
