import { ProjectController } from './projectController'

const Controller = (function() {
  
  const projectController = ProjectController
  const taskController

  return {
    project: projectController,
    task: taskController
  }
})()