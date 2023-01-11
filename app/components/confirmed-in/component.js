import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ConfirmedInComponent extends Component {
  @service kredits;

  @tracked confirmedAtBlock = null;

  constructor(confirmedAtBlock) {
    super(...arguments);
    this.confirmedAtBlock = confirmedAtBlock;
  }

  get confirmedInBlocks () {
    return this.confirmedAtBlock - this.kredits.currentBlock;
  }

  get confirmedInSeconds () {
    // A new block is mined every 30 seconds on average
    return this.confirmedInBlocks * 30;
  }
}
