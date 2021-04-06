import { EventAggregator } from '../events';

const ProjectController = (function() {

  function findProject(name) {
    EventAggregator.publish('requestProjects', {})

    EventAggregator.subscribe('projectsReceipt', projects => {
      for (let i = 0; i < projects.length; i++) {
        if (name === projects[i].title) return projects[i]
      }
      return new Error('Project not found');
    });
  };


  EventAggregator.subscribe('createProject', formData => {
    EventAggregator.publish('formToProject', formData);
  });

  
  EventAggregator.subscribe('projectFromForm', projectObj => {
    let newProject = projectObj;
    EventAggregator.publish('projectCreated', newProject);
  });
    


  let primedProject;
  EventAggregator.subscribe('primeProject', projectName => {
    primedProject = findProject(projectName);
  });


  EventAggregator.subscribe('createTask', formData => {
    EventAggregator.publish('formToTask', formData);
  });

  let newTask;
  EventAggregator.subscribe('taskFromForm', taskObj => {
    newTask = taskObj;
    primedProject.addTask(newTask);
    EventAggregator.publish('taskCreated', [newTask, primedProject.title]);
  });



  
})()

export { ProjectController }