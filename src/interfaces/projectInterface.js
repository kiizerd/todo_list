import { EventAggregator, Token } from '../events'
import { format } from 'date-fns'

const projectInterface = (function() {
  
  class Project {
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

      this.tasks = formData.tasks ? formData.tasks : [];
      this.completed = false;
      this.active = true;
    };

    getTask(taskName) {
      let result = false;
      for (const task of this.tasks) {
        if (task.title === taskName) {
          result = task;
          break
        };
      };

      return result;
    };

    addTask(taskObj) {
      this.tasks.push(taskObj);
    };

    completeTask(taskName) {
      const task = this.getTask(taskName);

      EventAggregator.publish('taskCompleted', {
        task: task,
        project: this
      });

      task.completeTask();

      const index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
    };

    removeTask(taskName) {
      const task = this.getTask(taskName);
      const index = this.tasks.indexOf(task);

      task.active = false;
      this.tasks.splice(index, 1);

      EventAggregator.publish('taskDeleted', task);

    };

    setProperties(newProps) {
      const content = document.getElementById('content');
      const title = this.title;
      
      for (const prop in newProps) {
        this[prop] = newProps[prop];
      };

      EventAggregator.publish('projectUpdated', [title, this]);

      content.setActivePage(newProps['title']);

    };

    completeProject() {
      this.active = false;
      this.completed = true;

      if (this.tasks.length === 0) {

        EventAggregator.publish('projectCompleted', this);

      } else {
        for (const task of this.tasks) {

          EventAggregator.publish('taskCompleted', [task, this]);

        };
        
        EventAggregator.publish('projectCompleted', this);

      };
    };

    deleteProject() {
      // delete all of the projects tasks 
      // database will remove project from listing
      this.tasks.length = 0;
      this.active = false;

      EventAggregator.publish('projectDeleted', this);

    };
    
  };


  EventAggregator.subscribe('formToProject', formData => {
    const newProject = new Project(formData);

    EventAggregator.publish('projectCreated', newProject);

  });


  EventAggregator.subscribe('storedProjectToProject', storedProject => {
    const newProject = new Project(storedProject);

    EventAggregator.publish('projectFromStorage', newProject);

  });


})();

export { projectInterface }
