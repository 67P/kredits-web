export default function () {
  this.transition(
    this.fromRoute('dashboard.index'),
    this.toRoute('dashboard.contributions'),
    this.media('(max-width: 600px)'),
    this.use('toLeft'),
    this.reverse('toRight'),
  );

  this.transition(
    this.fromRoute('dashboard.index'),
    this.toRoute('dashboard.contributors'),
    this.media('(max-width: 600px)'),
    this.use('toLeft'),
    this.reverse('toRight')
  );

  this.transition(
    this.fromRoute('dashboard.contributions'),
    this.toRoute('dashboard.contributors'),
    this.media('(max-width: 600px)'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
}
