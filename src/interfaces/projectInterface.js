import { EventAggregator } from '../events/events'
import { format } from 'date-fns'

const projectInterface = (function() {
  
  function Project(formData) {
    this.title = formData.title,
    this.description = formData.title,
    this.priority = formData.priority,
    this.dueDate = formData.dueDate,
    this.dateCreated = format(new Date(), 'yyyy-MM-dd'),
    this.tasks = []
  };

  EventAggregator.subscribe('formToProject', formData => {
    let newProject = Project(formData);

    EventAggregator.publish('ProjectFromForm', newProject);
  });

})();

export { projectInterface }