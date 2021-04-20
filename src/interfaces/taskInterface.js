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
    };

    getPrimedProject() {
      const reqToken = new Token('primedProjects', 'taskInterface');

      const reqObject = { _token: reqToken };
      
      let primedProject;
      EventAggregator.subscribe('primedProjectReceipt', project => {
        primedProject = project;
      });

      EventAggregator.publish('requestPrimedProject', reqObject);

      return primedProject;
    };

    setProperties(newProps) {
      const title = this.title
      for (const prop in newProps) {
        this[prop] = newProps[prop]
      };

      const primedProject = this.getPrimedProject();

      EventAggregator.publish('taskUpdated', [[title, this], primedProject]);

    };

    completeTask() {
      this.active = false;
      this.completed = true;
    };

  };


  EventAggregator.subscribe('formToTask', formData => {
    const newTask = new Task(formData);
    if (formData._token) newTask._token = formData._token;

    EventAggregator.publish('taskCreated', newTask);
  });

  
  EventAggregator.subscribe('storedTasksToTasks', args => {
    const newTaskList = [];

    for (const task of args[0]) {
      newTaskList.push(new Task(task));
    };
    
    EventAggregator.publish('tasksFromStorage', [newTaskList, args[1]]);
  });

})();

export { taskInterface }
