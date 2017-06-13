/**
 * This pauses the app's boot process until the window load event is fired.
 * It allows the user provided Web3 instance (e.g. Metamask, Mist Browser)
 * to be inserted before we try to use it.
 */
export default {
  name: 'defer-loading',
  initialize: function(application) {
    application.deferReadiness();

    window.addEventListener('load', function() {
      application.advanceReadiness();
    });
  }
};
