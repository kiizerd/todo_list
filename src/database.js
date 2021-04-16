import { EventAggregator } from './events'

const Database = (function() {

  const projects = {};

  const completed = {
    projects: {},
    tasks: {}
  };

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

    const completed = localStorage.completed

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
        'completed': completed
      }));

      EventAggregator.publish('storageUpdated', []);
    }, 100);    

    setTimeout(() => {
      EventAggregator.publish('updateDisplay', []);
    }, 200);    
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


  EventAggregator.subscribe('taskUpdated', args => {
    const task = args[0];
    const project = args[1];

    console.log(task, project);

    updateStorage();
  });


  function completeProject(project) {
    completed.projects[project.title] = project;
    
    project.deleteProject();
  };


  EventAggregator.subscribe('projectCompleted', project => {
    completeProject(project);
  });

  
  EventAggregator.subscribe('taskCompleted', args => {
    const task = args.task;
    const project = args.project;

    console.log(task, project);

    task.project = project

    completed.tasks[task.title] = task

    setTimeout(() => {
      updateStorage();
    }, 150);
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
    let result;
    if (options) {
      console.log('filter options', options);
      if (options.byName) {
        result = ary.filter(project => project.title === options.byName);
      }
    }
    else return ary
    return result
  };

  function sortProjects(options, ary) {
    let result
    if (options) {
      console.log('sort options', options);
      if (options.byName) {
        result = ary.sort((a, b) => {          
          const aTitle = [...a.title];
          const bTitle = [...b.title];

          let sortResult;
          if (options.byName === 'desc') {
            sortResult = aTitle == bTitle ? 0 : aTitle < bTitle ? -1 : 1;
          }
          if (options.byName === 'asc') {
            sortResult = aTitle == bTitle ? 0 : aTitle > bTitle ? -1 : 1;
          }
          
          return sortResult
        });
      };
    } else return ary
    return result
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
