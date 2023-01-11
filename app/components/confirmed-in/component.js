import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class ConfirmedInComponent extends Component {
  @service kredits;

  get confirmedInBlocks () {
    return this.args.confirmedAtBlock - this.kredits.currentBlock;
  }

  get confirmedInSeconds () {
    // A new block is mined every 30 seconds on average
    return this.confirmedInBlocks * 30;
  }

  get confirmedInHumanTime () {
    console.debug(this.confirmedInBlocks);
    console.debug(this.confirmedInSeconds);
    return moment.duration(this.confirmedInSeconds, "seconds").humanize();
  }
}
