import { EventAggregator } from '../events'
import { format } from 'date-fns'

const taskInterface = (function() {
  
  class Task {
    constructor(formData) {
      this.title = formData.title;
      this.description = formData.description;
      this.priority = parseInt(formData.priority);

      const dueDate = formData.dates.due;
      const startDate = formData.dates.started;

      console.log('task due date --', dueDate);
      console.log('task start date --', startDate);
      
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
    let newTask = new Task(formData);
    EventAggregator.publish('taskCreated', newTask);
  });

})();

export { taskInterface }
