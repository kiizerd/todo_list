import Display from './display/display';
import Database from './database';
import Controller from './controllers/controller';
import projectInterface from './interfaces/projectInterface';
import taskInterface from './interfaces/taskInterface';

const init = [
  projectInterface,
  taskInterface,
  Controller,
];

Display.init();

Database.initStorage();
