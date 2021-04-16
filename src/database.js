import { EventAggregator } from './events'

const Database = (function() {


  const projects = {};

  const completedProjects = {};

  function initStorage() {
    if (checkForStorage()) {
      loadStorage();
    } else {
      setupStorage();
    };
  };

  function checkForStorage() {
    return (window.localStorage.getItem('StorageObject') != null);
  };

  function getStoredProjects() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));
    
    const projects = localStorage.projects

    return projects
  };

  function getStoredCompleted() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    const completed = localStorage.projects

    return completed.length ? completed : null;
  }

  function loadStorage() {
    const storedProjects = getStoredProjects();
    const storedCompleted = getStoredCompleted();

    loadProjects(storedProjects);

    if (storedCompleted) loadProjects(storedCompleted);
    
    function loadProjects(list) {
      if (Object.entries(list).length) {
        for (const project in list) {
          const current = list[project];     
          
          if (current.tasks.length) {
            const newTaskList = current.tasks.map(task => {
              EventAggregator.subscribe('taskFromStorage', newTask => {
                task = newTask;
              });
              
              EventAggregator.publish('storedTaskToTask', task);
              
              return task
            });
  
            current.tasks = newTaskList
          };
  
          EventAggregator.subscribe('projectFromStorage', projectObj => {
            if (list === storedProjects) {
              projects[projectObj.title] = projectObj;
            } else {
              completedProjects[projectOjb.title] = projectObj;
            };
          });
  
          EventAggregator.publish('storedProjectToProject', current);
  
        };
      };
    };

  };
  
  function setupStorage() {
    window.localStorage.setItem('StorageObject', JSON.stringify({
      'projects': {}
    }));
  };

  function updateStorage() {
    setTimeout(() => {
      window.localStorage.setItem('StorageObject', JSON.stringify({
        'projects': projects,
        'completedProjects': completedProjects
      }));
    }, 200);

    setTimeout(() => {
      EventAggregator.publish('updateDisplay', []);
    }, 400);
    
  };

  
  EventAggregator.subscribe('projectCreated', projectObj => {    
    projects[projectObj.title] = projectObj;
    updateStorage();
  });

  
  EventAggregator.subscribe('taskCreated', taskObj => {
    updateStorage();
  });
  

  EventAggregator.subscribe('projectDeleted', project => {
    delete projects[project.title];
    updateStorage();
  });


  EventAggregator.subscribe('taskDeleted', taskName => {
    updateStorage();
  });


  function updateProject(projectName, updatedProject) {
    if (projectName === updatedProject.title) {
      projects[projectName] = updatedProject;
    } else {
      delete projects[projectName];
      projects[updatedProject.title] = updatedProject;
    };

    updateStorage();
  };

  
  EventAggregator.subscribe('projectUpdated', ([projectName, updatedProject]) => {
    updateProject(projectName, updatedProject);
  });


  function completeProject(project) {
    project.active = false;
    project.completed = true;

    completedProjects[project.title] = project;
    
    project.deleteProject();
  };


  EventAggregator.subscribe('projectCompleted', project => {
    completeProject(project);
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
    console.log('filter options', options);
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
    console.log('reqProjects', reqProjects);
    const filteredProjects = filterProjects(options.filter, reqProjects);
    const sortedProjects = sortProjects(options.sort, filteredProjects);

    if (options._token) sortedProjects._token = options._token;

    EventAggregator.publish('projectsReceipt', sortedProjects);
  });
  
  return { initStorage }

})();

export { Database }
