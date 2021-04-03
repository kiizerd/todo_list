import { EventAggregator } from './events/events'

const Database = (function() {
  const projects = {}
  
  function addProject(project) {
    projects[project.title] = project;
    console.log('projects: ', projects);
  };
    
  EventAggregator.subscribe('projectCreated', projectObj => {
    addProject(projectObj);
  });

  function filterProjects(options, ary) {
    
  }

  function sortProjects(options, ary) {
    
  };

  EventAggregator.subscribe('requestProjects', options => {
    let requestedProjects = Object.values(projects);
    if (options.filter) filterProjects(options.filter, requestedProjects);
    if (options.sort) sortProjects(options.sort, requestedProjects);
    EventAggregator.publish('projectsReceipt', requestedProjects);
  });


  function editProject(project, updatedProps) {
    for (const prop in project) {
      if (Object.keys(updatedProps).includes(prop)) {
        project[prop] = updatedProps[prop];
      };
    };
  };

  function deleteProject(projectName) {
    delete projects[projectName];
  };
  
  return {}
})()

export { Database }