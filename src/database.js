import { EventAggregator } from './events/events'

const Database = (function() {
  const projects = {}
  
  function addProject(project) {
    projects[project.title] = project;
  };
    
  EventAggregator.subscribe('projectCreated', projectObj => {
    addProject(projectObj);
  });

  function filterProjects(options) {
    this.select()
  }

  function sortProjects(options) {
    this.sort((p1, p2) => {
      if (p1.priority > p2.priority) return 1
      if (p1.priority < p2.priority) return -1
      if (p1.priority === p2.priority) {
        // sort by date due
      };
    });
  };

  EventAggregator.subscribe('requestProjects', options => {
    let requestedProjects = Object.values(projects);
    if (options.filter) filterProjects(options.filter).bind(requestedProjects);
    if (options.sort) sortProjects(options.sort).bind(requestedProjects);
    EventAggregator.publish('projectsReceipt', sortedProjects);
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