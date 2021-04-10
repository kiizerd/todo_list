import { EventAggregator } from '../events/events'

const taskInterface = (function() {
  
  function Task(formData) {
    this.title = formData.title,
    this.description = formData.description,
    this.priority = formData.priority,
    this.dates = {
      due: formData.due ? format(formData.due, 'PP') : null,
      started: format(formData.started ? formData.started : new Date(), 'PP')
    };
    this.completed = false;
    this.active = true;
  };

  Task.prototype.setProperties = function(newProps) {
    for (const prop in newProps) {
      if (this[prop]) {
        task[prop] = newProps[prop];
      };
    };
  };

  Task.prototype.completeTask = function() {
    this.completed = true;
  }



  EventAggregator.subscribe('formToTask', formData => {
    let newTask = Task(formData);

    EventAggregator.priority('taskFromForm', newTask);
  });

})();

export { taskInterface }