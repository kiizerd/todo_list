import { EventAggregator } from './events';
import { Display } from './display/display';
import { Database } from './database';
import { Controller } from './controllers/controller';
import { projectInterface } from './interfaces/projectInterface';
import { taskInterface } from './interfaces/taskInterface';

const init = [
  projectInterface,
  taskInterface,
  Controller
];

Display.init();

Database.initStorage();

function demoProjects() {

  EventAggregator.publish('createProject', {
    title: 'General',
    description: 'A non-specific list of generic tasks.',
    priority: 2,
    dates: {
      started: '',
      due: ''
    }
  });

  EventAggregator.publish('createProject', {
    title: 'Work',
    description: 'Tasks that need to be completed for your job.',
    priority: 0,
    dates: {
      started: '',
      due: new Date(2021, 4, 20)
    }
  });

  EventAggregator.publish('createProject', {
    title: 'House',
    description: 'A list of household chores and duties.',
    priority: 1,
    dates: {
      started: '',
      due: ''
    }

  });
  
};

// demoProjects();
