import Event from './event';

const EventAggregator = ((function iife() {
  const events = [];

  function getEvent(eventName) {
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].name === eventName) return events[i];
    }

    return null;
  }

  function publish(eventName, eventArgs) {
    let event = getEvent(eventName);

    if (!event) {
      event = new Event(eventName);
      events.push(event);
    }

    event.fire(eventArgs);
  }

  function subscribe(eventName, handler) {
    let event = getEvent(eventName);

    if (!event) {
      event = new Event(eventName);
      events.push(event);
    }

    event.addHandler(handler);
  }

  return { publish, subscribe };
})());

export default EventAggregator;
