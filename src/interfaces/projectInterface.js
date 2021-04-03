import { EventAggregator } from '../events/events'
import { format } from 'date-fns'

const projectInterface = (function() {
  
  function Project(formData) {
    this.title = formData.title;
    this.description = formData.description;
    this.priority = formData.priority;
    this.dueDate = formData.dueDate;
    this.dateCreated = format(new Date(), 'yyyy-MM-dd');
    this.tasks = [];
  };

  Project.prototype.addTask = function(taskObj) {
    this.tasks.push(taskObj);
  }

  EventAggregator.subscribe('formToProject', formData => {
    let newProject = new Project(formData);

    EventAggregator.publish('projectFromForm', newProject);
  });

})();

export { projectInterface }