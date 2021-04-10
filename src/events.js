class Event {
  constructor(name) {
    this._handlers = [];
    this.name = name;
  };

  addHandler(handler) {
    let check = true
    for (let i = 0; i < this._handlers.length; i++) {
      if (this._handlers[i] == handler) { check = false }
    };
    if (check) this._handlers.push(handler);
    else return false
  };

  removeHandler(handler) {
    for (let i = 0; i < this._handlers.length; i++) {
      if (this._handlers[i] === handler) {
        this._handlers.splice(i, 1);
        break;
      };
    };
  };

  fire(eventArgs) {
    this._handlers.forEach(handler => {
      handler(eventArgs);
    });
  };

};

class Token {
  constructor(event, master) {
    let tokenCounter = 0;
    let idString = this.generateId(`${event}_${master}`);
    this._id = `${idString}` + `${tokenCounter++}`;
  };

  generateId(string) {
    const result = []
    for (const char in string.split('')) {
      result.push(string.charCodeAt(char));
    };
    return result.join('')
  };
};


const EventAggregator = (function() {
  const events = [];
  let handlerTagCounter = 0;

  function getEvent(eventName) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].name === eventName) return events[i];
    };
  };

  function publish(eventName, eventArgs) {
    let event = getEvent(eventName);
    
    if (!event) {
      event = new Event(eventName);
      events.push(event);
    }

    event.fire(eventArgs);
  };

  function subscribe(eventName, handler) {
    let event = getEvent(eventName);

    if (!event) {
      event = new Event(eventName);
      events.push(event);
    }
    
    event.addHandler(handler);
  };

  return { publish, subscribe };
})();

export { EventAggregator, Token }