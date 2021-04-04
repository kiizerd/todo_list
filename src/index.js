import { EventAggregator } from './events/events';
import { Display } from './display/display';
import { Database } from './database';
import { Controller } from './controllers/controller';
import { projectInterface } from './interfaces/projectInterface';

projectInterface;
Database;
Controller;

EventAggregator.publish('createProject', {
  title: 'Project 1',
  description: 'a small summary of the project',
  priority: 0,
  dueDate: new Date(2069, 3, 8)
});

EventAggregator.publish('createProject', {
  title: 'Project 12',
  description: 'a small summary of the project not too big not too small',
  priority: 1,
  dueDate: new Date(2022, 1, 7)
});

EventAggregator.publish('createProject', {
  title: 'Project 412',
  description: 'a small summary of the project not too big not too small',
  priority: 2,
  dueDate: new Date(2022, 6, 9)
});

Display.init();