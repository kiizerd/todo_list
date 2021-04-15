import { EventAggregator, Token } from '../events'
import { format } from 'date-fns'

const taskInterface = (function() {
  
  class Task {
    constructor(formData) {
      this.title = formData.title;
      this.description = formData.description;
      this.priority = formData.priority ? parseInt(formData.priority) : 1;

      const dueDate = formData.dates.due;
      const startDate = formData.dates.started;

      this.dates = {
        due: dueDate ? format(new Date(dueDate), 'PP') : null,
        started: startDate ? format(new Date(startDate), 'PP') : format(new Date(), 'PP')
      };

      this.completed = false;
      this.active = true;
    }

    setProperties(newProps) {
      for (const prop in newProps) {
        if (this[prop]) {
          task[prop] = newProps[prop];
        };
      };
    };

    completeTask() {
      this.completed = true;
    }
  };


  EventAggregator.subscribe('formToTask', formData => {
    const newTask = new Task(formData);
    if (formData._token) newTask._token = formData._token;

    EventAggregator.publish('taskCreated', newTask);
  });

  
  EventAggregator.subscribe('storedTaskToTask', storedTask => {
    const newTask = new Task(storedTask);

    EventAggregator.publish('taskFromStorage', newTask);
  });

})();

export { taskInterface }
