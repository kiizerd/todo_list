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

  function getCompleted() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    const completed = localStorage.completed;

    return completed.length ? completed : null;
  };
  
  
  EventAggregator.subscribe('projectFromStorage', projectObj => {
    projectObj.tasks = projects[projectObj.title].tasks;

    projects[projectObj.title] = projectObj;
  });

  
  EventAggregator.subscribe('tasksFromStorage', args => {
    const newTaskList = args[0];
    const project = args[1];

    projects[project] = { tasks: newTaskList };
  });


  function loadStorage() {
    const storedProjects = getStoredProjects();
    const storedCompleted = getCompleted();

    if (storedCompleted && storedCompleted.projects) {
      loadFrom(storedCompleted.projects);
    };

    if (storedCompleted && storedCompleted.tasks) {
      loadFrom(storedCompleted.tasks);
    };
    
    loadFrom(storedProjects);
    
    function loadFrom(source) {
      if (Object.entries(source).length) {

        for (const item in source) {
          const current = source[item];

          switch (source) {
            case storedProjects:
              
              if (current.tasks.length) {
                EventAggregator.publish('storedTasksToTasks', [
                  current.tasks, 
                  current.title
                ]);
              };
              
              EventAggregator.publish('storedProjectToProject', current);
              
              break;

            case storedCompleted.projects:

              completed.projects[current.title] = current;

              break;

            case storedCompleted.tasks:

              completed.tasks[current.title] = current;

              break;
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
    return result ? result : [];
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
    
    const filtered = filterProjects(options.filter, reqProjects);
    const sorted = sortProjects(options.sort, filtered);

    if (options._token) sorted._token = options._token;

    EventAggregator.publish('projectsReceipt', sorted);
  });


  EventAggregator.subscribe('requestCompletedTasks', options => {    
    const tasks = Object.values(completed.tasks);

    result = { tasks };

    if (options._token) result._token = options._token;

    EventAggregator.publish('completedTasksReceipt', result);
  });


  EventAggregator.subscribe('requestCompletedProjects', options => {    
    const projects = Object.values(completed.projects);

    result = { projects };

    if (options._token) result._token = options._token;

    EventAggregator.publish('completedProjectsReceipt', result);
  });
  
  return { initStorage }

})();

export { Database }
