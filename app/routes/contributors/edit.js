import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { alias } from '@ember/object/computed';

export default Route.extend({

  kredits: service(),
  contributors: alias('kredits.contributors'),

  model(params) {
    return this.kredits.contributors.findBy('id', params.id);
  },

  setupController (controller, model) {
    this._super(controller, model);

    controller.set('attributes', {
      account: model.account,
      name: model.name,
      kind: model.kind,
      url: model.url,
      github_username: model.github_username,
      github_uid: model.github_uid,
      gitea_username: model.gitea_username,
      wiki_username: model.wiki_username
    });
  }

});
