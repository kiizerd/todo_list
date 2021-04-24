import { EventAggregator, Token } from '../events/events';

const ProjectController = ((function iife() {
  let primedProject;

  const requestToken = new Token('requestProjects', 'projectController');

  EventAggregator.subscribe('primeProject', (projectName) => {
    primedProject = projectName;
    const reqOptions = {
      filter: {
        byName: primedProject,
      },
      token: requestToken,
    };

    EventAggregator.publish('requestProjects', reqOptions);
  });

  EventAggregator.subscribe('projectsReceipt', (projects) => {
    if (projects.token && (projects.token.id === requestToken.id)) {
      [primedProject] = projects;
    } else { return false; }
    return null;
  });

  EventAggregator.subscribe('requestPrimedProject', (reqObj) => {
    const resObj = primedProject;
    if (reqObj.token) resObj.token = reqObj.token;
    EventAggregator.publish('primedProjectReceipt', resObj);
  });

  EventAggregator.subscribe('createProject', (formData) => {
    EventAggregator.publish('formToProject', formData);
  });

  const taskToken = new Token('formToTask', 'projectController');

  EventAggregator.subscribe('createTask', (formData) => {
    const tokenizedFormData = formData;
    tokenizedFormData.token = taskToken;
    EventAggregator.publish('formToTask', tokenizedFormData);
  });

  EventAggregator.subscribe('taskCreated', (taskObj) => {
    const task = taskObj;
    if (task.token && (task.token.id === taskToken.id)) {
      delete task.token;
      primedProject.addTask(task);
    }
  });
})());

export default ProjectController;
