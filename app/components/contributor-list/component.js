import Component from '@ember/component';

export default Component.extend({

  tagName: 'table',
  classNames: 'contributor-list',
  selectedContributor: null,

  actions: {

    toggleContributorInfo(contributor) {
      if (contributor.showMetadata) {
        contributor.set('showMetadata', false);
      } else {
        this.contributorList.setEach('showMetadata', false);
        contributor.set('showMetadata', true);
      }
    }

  }

});
