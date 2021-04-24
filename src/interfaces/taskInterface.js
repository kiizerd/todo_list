import { format } from 'date-fns';
import { EventAggregator, Token } from '../events/events';

const taskInterface = ((function iife() {
  const reqToken = new Token('primedProjects', 'taskInterface');

  const reqObject = { _token: reqToken };

  let primedProject;
  EventAggregator.subscribe('primedProjectReceipt', (project) => {
    primedProject = project;
  });

  function getPrimedProject() {
    EventAggregator.publish('requestPrimedProject', reqObject);

    return primedProject;
  }

  class Task {
    constructor(formData) {
      this.title = formData.title;
      this.description = formData.description;
      this.priority = formData.priority ? Number(formData.priority) : 1;

      const dueDate = formData.dates.due;
      const startDate = formData.dates.started;

      this.dates = {
        due: dueDate ? format(new Date(dueDate), 'PP') : null,
        started: startDate ? format(new Date(startDate), 'PP') : format(new Date(), 'PP'),
      };

      this.completed = false;
      this.active = true;
    }

    setProperties(newProps) {
      const { title } = this;
      Object.entries(newProps).forEach((prop) => {
        this[prop] = newProps[prop];
      });

      const primed = getPrimedProject();

      EventAggregator.publish('taskUpdated', [[title, this], primed]);
    }

    completeTask() {
      this.active = false;
      this.completed = true;
    }
  }

  EventAggregator.subscribe('formToTask', (formData) => {
    const newTask = new Task(formData);
    if (formData.token) newTask.token = formData.token;

    EventAggregator.publish('taskCreated', newTask);
  });

  EventAggregator.subscribe('storedTasksToTasks', (args) => {
    const newTaskList = [];

    args[0].forEach((task) => {
      newTaskList.push(new Task(task));
    });

    EventAggregator.publish('tasksFromStorage', [newTaskList, args[1]]);
  });
})());

export default taskInterface;
