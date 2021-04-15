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

  function loadStorage() {
    const storedProjects = getStoredProjects();
    if (Object.entries(storedProjects).length) {
      for (const project in storedProjects) {
        const current = storedProjects[project];     
        
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
          projects[projectObj.title] = projectObj;
        });

        EventAggregator.publish('storedProjectToProject', current);

      };
    };
    
  };
  
  function setupStorage() {
    window.localStorage.setItem('StorageObject', JSON.stringify({
      'projects': {}
    }));
  };

  function checkStorageFor(projectName) {
    const stored = getStoredProjects();
    const storedAry = Object.entries(stored);
    
    let check = true;
    for (const project of storedAry) {
      if (project.title === projectName) check = false
    }

    return check
  };

  function updateStorage() {
    setTimeout(() => {
      window.localStorage.setItem('StorageObject', JSON.stringify({
        'projects': projects
      }));
    }, 500);
  };

  function storeProject(newProject) {
    const stored = getStoredProjects();
    
    if (checkStorageFor(newProject.title)) {
      stored[newProject.title] = newProject;
      console.log('storing new project');
      
      window.localStorage.setItem('StorageObject', JSON.stringify({
        projects: stored
      }));
    };

  };
  
  EventAggregator.subscribe('projectCreated', projectObj => {    
    projects[projectObj.title] = projectObj;
    updateStorage();
  });

  
  EventAggregator.subscribe('taskCreated', taskObj => {
    updateStorage();
  });


  // function completeStoredProject() {

  // };

  // function completeProject(project) {
  //   completedProjects[project.title] = project;

  //   project.active = false;
  //   project.completed = true;

  //   deleteProject(project.title);
  // };

  // EventAggregator.subscribe('projectCompleted', completedProject => {
  //   completeProject(project);
  // });

  // function updateStoredProject(projectName, updatedProject) {
  //   const stored = getStoredProjects();

  //   if (!checkStorageFor(projectName)) {
  //     if (projectName === updatedProject.title) {
  //       stored[projectName] = updatedProject;
  //     } else {
  //       delete stored[projectName];
  //       stored[updatedProject.title] = updatedProject;
  //     };
  //   };

  //   window.localStorage.setItem('StorageObject', JSON.stringify({
  //     projects: stored
  //   }));

  // };


  // function updateProject(projectName, updatedProject) {
  //   if (projectName === updatedProject.title) {
  //     projects[projectName] = updatedProject;
  //   } else {
  //     delete projects[projectName];
  //     projects[updatedProject.title] = updatedProject;
  //   };
  // };

  // EventAggregator.subscribe('projectUpdated', (projectName, updatedProject) => {
  //   updateStoredProject(projectName, updatedProject);
  //   updateProject(projectName, updatedProject);
  // });

  
  EventAggregator.subscribe('projectDeleted', projectName => {
    delete projects[projectName];
    updateStorage();
  });


  EventAggregator.subscribe('taskDeleted', taskName => {
    updateStorage();
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
    const filteredProjects = filterProjects(options.filter, reqProjects);
    const sortedProjects = sortProjects(options.sort, filteredProjects);

    if (options._token) sortedProjects._token = options._token;

    EventAggregator.publish('projectsReceipt', sortedProjects);
  });
  
  return { initStorage }

})();

export { Database }
