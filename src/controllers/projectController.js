import { EventAggregator, Token } from '../events';

const ProjectController = (function() {

  let primedProject;
  const requestToken = new Token('requestProjects', 'projectController');
  EventAggregator.subscribe('primeProject', projectName => {   
    primedProject = projectName;
    const reqOptions = {
      filter: {
        byName: primedProject
      },
      _token: requestToken
    };

    EventAggregator.publish('requestProjects', reqOptions);
  });

  
  EventAggregator.subscribe('projectsReceipt', projects => {
    if (projects._token && projects._token._id === requestToken._id) {
      primedProject = projects[0];
      console.log(primedProject);
    } else { return false }
  });

  
  EventAggregator.subscribe('createProject', formData => {
    EventAggregator.publish('formToProject', formData);
  });


  EventAggregator.subscribe('createTask', formData => {
    EventAggregator.publish('formToTask', formData);
  });
  

  EventAggregator.subscribe('taskCreated', taskObj => {
    primedProject.addTask(taskObj);
  });


})()

export { ProjectController }