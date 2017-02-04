import Ember from 'ember';
import Contributor from 'kredits-web/models/contributor';

let fixtures = [
  { github_username: "bumi", github_uid: "318", kredits: 18000 },
  { github_username: "galfert", github_uid: "843", kredits: 15000 },
  { github_username: "basti", github_uid: "842", kredits: 13000 },
  { github_username: "silverbucket", github_uid: "317571", kredits: 13000 },
  { github_username: "janlelis", github_uid: "111510", kredits: 12000 },
  { github_username: "gregkare", github_uid: "43297", kredits: 11000 },
  { github_username: "fsmanuel", github_uid: "54812", kredits: 8000 },
  { github_username: "bkero", github_uid: "128776", kredits: 7000 },
  // { github_username: "arzu", github_uid: "", kredits: 4000 }
];

export default Ember.Route.extend({

  kredits: Ember.inject.service(),

  model() {
    let contributors = [];
    this.get('kredits.contributors').forEach(obj => {
      contributors.pushObject(Contributor.create(obj));
    });

    return {
      contributors: contributors
    };
  }

});
