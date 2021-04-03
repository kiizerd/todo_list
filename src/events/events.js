function Event (name) {
  this._handlers = [];
  this.name = name;
}

Event.prototype.addHandler = function(handler) {
  this._handlers.push(handler);
};

Event.prototype.removeHandler = function(handler) {
  for (let i = 0; i < this._handlers.length; i++) {
    if (this._handlers[i] == handler) {
      this._handlers.splice(i, 1);
      break;
    }
  }
};

Event.prototype.fire = function(eventArgs) {
  this._handlers.forEach(handler => {
    handler(eventArgs);
  });
};

const EventAggregator = (function() {
  const events = [];

  function getEvent(eventName) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].name === eventName) return events[i]
    }
    console.log('event not found')
    return new Event(eventName);
  };

  function publish(eventName, eventArgs) {
    getEvent(eventName).fire(eventArgs);
  };

  function subscribe(eventName, handler) {
    getEvent(eventName).addHandler(handler);
  };

  return { publish, subscribe };
})();

export { EventAggregator }