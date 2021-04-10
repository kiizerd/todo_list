import { EventAggregator } from './events'

const Database = (function() {
  const projects = {}
  
  function addProject(project) {
    projects[project.title] = project;
  };
    
  EventAggregator.subscribe('projectCreated', projectObj => {
    addProject(projectObj);
  });

  // options = {
  //   filter: {
  //     byName: '', // projectName - will return projects with title matching string
  //     byPriority: '', // 0 1 or 2 - will return projects with matching priority 
  //     byDateDue: '',
  //     byDateStarted: ''
  //   },
  //   sort: {
  //     byName: '', // 0 or 1
  //     byPriority: '', // for asc
  //     byDateDue: '', // or desc
  //     byDateStarted: ''    
  //   }
  // }

  function filterProjects(options, ary) {
    console.log(options);
    let result;
    if (options) {
      if (options.byName) {
        result = ary.filter(project => project.title === options.byName);
      }
    }
    else return ary
    return result
  };

  function sortProjects(options, ary) {
    
    return ary
  };

  EventAggregator.subscribe('requestProjects', options => {
    const reqProjects = Object.values(projects);
    const filteredProjects = filterProjects(options.filter, reqProjects);
    const sortedProjects = sortProjects(options.sort, filteredProjects);
    if (options._token) sortedProjects._token = options._token;
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
