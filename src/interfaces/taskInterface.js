import { EventAggregator } from '../events/events'

const taskInterface = (function() {
  
  function Task(formData) {
    this.title = formData.title,
    this.description = formData.description,
    this.priority = formData.priority,
    this.dueDate = formData.dueDate
  };

  EventAggregator.subscribe('formToTask', formData => {
    let newTask = Task(formData);

    EventAggregator.priority('taskFromForm', newTask);
  });

})();

export { taskInterface }