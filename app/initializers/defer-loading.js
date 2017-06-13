/**
 * This pauses the app's boot process until the window load event is fired.
 * It allows the user provided Web3 instance (e.g. Metamask, Mist Browser)
 * to be inserted before we try to use it.
 */
export default {
  name: 'defer-loading',
  initialize: function(application) {
    // Load event already fired, so web3 should be loaded if available
    if (window.windowLoadComplete) { return true; }

    // Pause app loading
    application.deferReadiness();

    window.addEventListener('load', function() {
      // Continue app loading
      application.advanceReadiness();
    });
  }
};
