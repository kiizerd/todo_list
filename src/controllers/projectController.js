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
    if (projects._token && (projects._token._id === requestToken._id)) {
      primedProject = projects[0];
      console.log('Primed project --> ', primedProject);
    } else { return false }
    
    EventAggregator.subscribe('requestPrimedProject', reqObj => {
      let resObj = primedProject;
      if (reqObj._token) resObj._token = reqObj._token;
      EventAggregator.publish('primedProjectReceipt', primedProject);

      delete resObj._token;
    });
  });

  
  EventAggregator.subscribe('createProject', formData => {
    EventAggregator.publish('formToProject', formData);
  });


  const taskToken = new Token('formToTask', 'projectController');

  EventAggregator.subscribe('createTask', formData => {
    formData._token = taskToken;
    EventAggregator.publish('formToTask', formData);
  });
  

  EventAggregator.subscribe('taskCreated', taskObj => {
    if (taskObj._token && (taskObj._token._id === taskToken._id)) {
      primedProject.addTask(taskObj);

      delete taskObj._token
    };
  });


})()

export { ProjectController }