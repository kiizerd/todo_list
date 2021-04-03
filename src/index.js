import { Display } from './display/display';
import { EventAggregator } from './events/events';
import { Database } from './database'
import { Controller } from './controllers/controller'
import { projectInterface } from './interfaces/projectInterface'

projectInterface;
Database;
Controller;
Display.init();

EventAggregator.publish('createProject', {
  title: 'project 1',
  description: 'a small summary of the project',
  priority: 0,
  dueDate: '2022-06-09'
});
