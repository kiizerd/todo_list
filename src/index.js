import { EventAggregator } from './events';
import { Display } from './display/display';
import { Database } from './database';
import { Controller } from './controllers/controller';
import { projectInterface } from './interfaces/projectInterface';

projectInterface;
Database;
Controller;

EventAggregator.publish('createProject', {
  title: 'General',
  description: 'A non-specific list of generic tasks.',
  priority: 1,
  dueDate: new Date(2069, 3, 8)
});

EventAggregator.publish('createProject', {
  title: 'Work',
  description: 'Tasks that need to be completed for your job.',
  priority: 1,
  dueDate: new Date(2022, 1, 7)
});

EventAggregator.publish('createProject', {
  title: 'Home',
  description: 'A list of household chores and duties.',
  priority: 1,
  dueDate: new Date(2022, 6, 9)
});

Display.init();