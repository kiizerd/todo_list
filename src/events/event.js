class Event {
  constructor(name) {
    this.handlers = [];
    this.name = name;
  }

  addHandler(handler) {
    let check = true;
    for (let i = 0; i < this.handlers.length; i += 1) {
      if (this.handlers[i] === handler) { check = false; }
    }
    if (check) this.handlers.push(handler);
    else return false;

    return check || handler;
  }

  removeHandler(handler) {
    for (let i = 0; i < this.handlers.length; i += 1) {
      if (this.handlers[i] === handler) {
        this.handlers.splice(i, 1);
        break;
      }
    }
  }

  fire(eventArgs) {
    this.handlers.forEach((handler) => {
      handler(eventArgs);
    });
  }
}

export default Event;
