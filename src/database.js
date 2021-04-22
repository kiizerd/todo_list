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

    setTimeout(() => {
      updateStorage();
    }, 150);
    
  };

  function checkForStorage() {
    return (window.localStorage.getItem('StorageObject') != null);
  };

  function getStoredProjects() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));
    
    const projects = localStorage.projects

    return projects ? projects : null;
  };

  function getCompletedProjects() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    const completed = localStorage.completed.projects;

    return completed ? completed : null;
  };

  function getCompletedTasks() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    const completed = localStorage.completed.tasks;

    return completed ? completed : null;
  };
  
  
  EventAggregator.subscribe('projectFromStorage', projectObj => {
    if (projects[projectObj.title]) {
      projectObj.tasks = projects[projectObj.title].tasks;
    };

    projects[projectObj.title] = projectObj;
  });

  
  EventAggregator.subscribe('tasksFromStorage', args => {
    const newTaskList = args[0];
    const project = args[1];

    projects[project] = { tasks: newTaskList };
  });


  function loadStorage() {
    const storage = [
      getStoredProjects(),
      getCompletedProjects(),
      getCompletedTasks()
    ];

    for (const stored of storage) {
      if (stored) {
        for (const object in stored) {
          if (stored === storage[0]) {
            
            if (stored[object].tasks && stored[object].tasks.length) {
              EventAggregator.publish('storedTasksToTasks', [
                stored[object].tasks, 
                stored[object].title
              ]);
            };
            
            EventAggregator.publish('storedProjectToProject', stored[object]);

          } else if (stored === storage[1]) {
            completed.projects[stored[object].title] = stored[object];
          } else if (stored === storage[2]) {
            completed.tasks[stored[object].title] = stored[object];
          };

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
    const task = args[0];
    const project = args[1];

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

  function filter(options, ary) {
    let result;
    if (options) {
      console.log('filter options', options);
      if (options.byName) {
        result = ary.filter(project => project.title === options.byName);
      }
    }
    else return ary
    return result ? result : [];
  };

  function sort(options, ary) {
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

  function getList(list, options) {
    let result
    switch (list) {
      case 'projects':
        result = Object.values(projects);
        break;
      case 'completedProjects':
        result = Object.values(completed.projects);
        break;
      case 'completedTasks':
        result = Object.values(completed.tasks);
        break;
    };

    return sort(options.sort, filter(options.filter, result));
  };


  EventAggregator.subscribe('requestProjects', options => {
    const result = getList('projects', options);

    if (options._token) result._token = options._token;

    EventAggregator.publish('projectsReceipt', result);
  });


  EventAggregator.subscribe('requestCompletedTasks', options => {
    const result = getList('completedTasks', options);

    if (options._token) result._token = options._token;

    EventAggregator.publish('completedTasksReceipt', result);
  });


  EventAggregator.subscribe('requestCompletedProjects', options => {    
    const result = getList('completedProjects', options);

    if (options._token) result._token = options._token;

    EventAggregator.publish('completedProjectsReceipt', result);
  });
  
  return { initStorage }

})();

export { Database }
