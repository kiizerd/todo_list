import { EventAggregator } from '../events'
import { format } from 'date-fns'

const projectInterface = (function() {
  
  function Project(formData) {
    this.title = formData.title;
    this.description = formData.description;
    this.priority = formData.priority;
    this.dates = {
      due: formData.due ? format(formData.due, 'PP') : null,
      started: format(formData.started ? formData.started : new Date(), 'PP')
    }
    this.tasks = [];
  };

  Project.prototype.addTask = function(taskObj) {
    this.tasks.push(taskObj);
  }

  EventAggregator.subscribe('formToProject', formData => {
    let newProject = new Project(formData);

    EventAggregator.publish('projectCreated', newProject);
  });

})();

export { projectInterface }