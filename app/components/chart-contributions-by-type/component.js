import Component from '@ember/component';
import { computed } from '@ember/object';

let categoryColors = {
  community: "#fb6868",
  design: "#fbe468",
  dev: "#e068fb",
  docs: "#97fb68",
  ops: "#8f68fb",
}

export default Component.extend({

  contributions: null,

  chartData: computed('contributions', function() {
    let kredits = this.get('contributions')
                      .map(c => {
                        return { kind: c.kind, amount: c.amount }
                      }).reduce(function (kinds, c) {
                        if (c.kind in kinds) {
                          kinds[c.kind] = kinds[c.kind] + c.amount
                        } else {
                          kinds[c.kind] = c.amount;
                        }
                        return kinds;
                      }, {});

    return {
      datasets: [{
        data: [
          kredits['community'],
          kredits['design'],
          kredits['dev'],
          kredits['ops'],
          kredits['docs'],
        ],
        borderColor: [
          categoryColors.community,
          categoryColors.design,
          categoryColors.dev,
          categoryColors.ops,
          categoryColors.docs,
        ],
        borderWidth: 1
      }],
      labels: [
        'Community',
        'Design',
        'Development',
        'Operations & Infrastructure',
        'Documentation'
      ],
    }
  }),

  chartOptions: {
    legend: {
      display: false
    }
  }

});
