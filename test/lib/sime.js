// Never intended to be used in production environment.
var simE = (function() {

function simEvent (node, type, data) {
  // Currently data is not used.

  if (!(node && node.nodeType)) {
    throw new Error('Not a valid DOM node');
  }

  if (!type) {
    throw new Error('Must specify an event type');
  }

  if (node.dispatchEvent) {
    // W3C way.
    var event = document.createEvent("HTMLEvents");
    // Always bubbling and cancellable.
    event.initEvent(type, true, true);
    return node.dispatchEvent(event);
  } else if (node.fireEvent) {
    // The M$ way, which is the better.
    return node.fireEvent('on' + type);
  } else {
    throw new Error('Your browser is way too old.');
  }
}

return simEvent;

})();
