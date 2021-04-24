import ProjectController from './projectController';

const Controller = ((function iife() {
  const projectController = ProjectController;

  return {
    project: projectController,
  };
})());

export default Controller;
