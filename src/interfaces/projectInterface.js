import { EventAggregator } from '../events'
import { format } from 'date-fns'

const projectInterface = (function() {
  
  class Project {
    constructor(formData) {
      this.title = formData.title;
      this.description = formData.description;
      this.priority = parseInt(formData.priority);
      
      const dueDate = formData.dates.due;
      const startDate = formData.dates.started;

      console.log('project due date --', dueDate);
      console.log('project start date --', startDate);

      this.dates = {
        due: dueDate ? format(new Date(dueDate), 'PP') : null,
        started: startDate ? format(new Date(startDate), 'PP') : format(new Date(), 'PP')
      };

      this.tasks = [];
      this.completed = false;
      this.active = true;
    }

    getTask(taskName) {
      for (const task of this.tasks) {
        if (task.title = taskName) {
          return task;
        };
      };

      return new Error('Task not found');
    }

    addTask(taskObj) {
      this.tasks.push(taskObj);
    }

    completeTask(taskName) {
      const task = this.getTask(taskName);

      EventAggregator.publish('taskCompleted', {
        task: task,
        project: this
      });

      task.completeTask();
    }

    removeTask(taskName) {
      const task = this.getTask(taskName);
      const index = this.tasks.indexOf(task);


      task.active = false;
      this.task.splice(index, 1);

      EventAggregator.publish('taskDeleted', task);
    }

    setProperties(newProps) {
      for (const prop in newProps) {
        if (this[prop]) {
          this[prop] = newProps[prop];
        };
      };
    }

    completeProject() {
      if (this.tasks.length === 0)
        EventAggregator.publish('projectCompleted', this);
    }

    deleteProject() {
      // delete all of the projects tasks 
      // database will remove project from listing
      this.tasks.length = 0;
      this.active = false;
      EventAggregator.publish('projectDeleted', this);
    }
  };

  EventAggregator.subscribe('formToProject', formData => {
    let newProject = new Project(formData);

    EventAggregator.publish('projectCreated', newProject);
  });

})();

export { projectInterface }
