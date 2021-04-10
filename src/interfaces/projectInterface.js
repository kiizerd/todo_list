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
    this.completed = false;
    this.active = true;
  };

  Project.prototype.getTask = function(taskName) {
    for (const task of this.tasks) {
      if (task.title = taskName) {
        return task
      };
    };

    return new Error('Task not found');
  };

  Project.prototype.addTask = function(taskObj) {
    this.tasks.push(taskObj);
  };

  Project.prototype.completeTask = function(taskName) {
    const task = this.getTask(taskName);

    EventAggregator.publish('taskCompleted', {
      task: task,
      project: this
    });

    task.completeTask();
  };

  Project.prototype.removeTask = function(taskName) {
    const task = this.getTask(taskName);
    const index = this.tasks.indexOf(task);

    
    task.active = false;
    this.task.splice(index, 1);

    EventAggregator.publish('taskDeleted', task);
  };

  Project.prototype.setProperties = function(newProps) {
    for (const prop in newProps) {
      if (this[prop]) {
        this[prop] = newProps[prop];
      };
    };
  };

  Project.prototype.completeProject = function() {
    if (this.tasks.length === 0)
    EventAggregator.publish('projectCompleted', this)
  };

  Project.prototype.deleteProject = function() {
    // delete all of the projects tasks 
    // database will remove project from listing

    this.tasks.length = 0;
    this.active = false;
    EventAggregator.publish('projectDeleted', this);
  };

  EventAggregator.subscribe('formToProject', formData => {
    let newProject = new Project(formData);

    EventAggregator.publish('projectCreated', newProject);
  });

})();

export { projectInterface }