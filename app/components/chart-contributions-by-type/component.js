import Component from '@ember/component';

export default Component.extend({

  chartData: {
    datasets: [{
        data: [10, 20, 30]
    }],
    labels: [
        'Red',
        'Yellow',
        'Blue'
    ]
  },

  chartOptions: {
    legend: {
      display: false
    }
  }

});
