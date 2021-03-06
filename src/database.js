import { EventAggregator } from './events/events';

const Database = ((function iife() {
  const projects = {};

  const completed = {
    projects: {},
    tasks: {},
  };

  function checkForStorage() {
    const storage = window.localStorage.getItem('StorageObject');
    return storage || null;
  }

  function getStoredProjects() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    const storedProjects = localStorage.projects;

    return storedProjects || null;
  }

  function getCompletedProjects() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    if (!localStorage.completed) return null;

    const completedProjects = localStorage.completed.projects;

    return completedProjects || null;
  }

  function getCompletedTasks() {
    const localStorage = JSON.parse(window.localStorage.getItem('StorageObject'));

    if (!localStorage.completed) return null;

    const completedTasks = localStorage.completed.tasks;

    return completedTasks || null;
  }

  function loadStorage() {
    const storage = [
      getStoredProjects(),
      getCompletedProjects(),
      getCompletedTasks(),
    ];

    storage.forEach((stored) => {
      if (stored) {
        Object.values(stored).forEach((object) => {
          if (stored === storage[0]) {
            if (object.tasks && object.tasks.length) {
              EventAggregator.publish('storedTasksToTasks', [
                object.tasks,
                object.title,
              ]);
            }
            EventAggregator.publish('storedProjectToProject', object);
          } else if (stored === storage[1]) {
            completed.projects[object.title] = object;
          } else if (stored === storage[2]) {
            completed.tasks[object.title] = object;
          }
        });
      }
    });
  }

  function setupStorage() {
    window.localStorage.setItem('StorageObject', JSON.stringify({
      projects: {},
    }));
  }

  function updateStorage() {
    setTimeout(() => {
      window.localStorage.setItem('StorageObject', JSON.stringify({
        projects,
        completed,
      }));

      EventAggregator.publish('storageUpdated', []);
    }, 50);

    setTimeout(() => {
      EventAggregator.publish('updateDisplay', []);
    }, 100);
  }

  function initStorage() {
    if (checkForStorage()) {
      loadStorage();
    } else {
      setupStorage();
    }

    setTimeout(() => {
      updateStorage();
    }, 75);
  }

  EventAggregator.subscribe('projectFromStorage', (projectObj) => {
    if (projects[projectObj.title]) {
      const project = projectObj;
      project.tasks = projects[projectObj.title].tasks;
    }

    projects[projectObj.title] = projectObj;
  });

  EventAggregator.subscribe('tasksFromStorage', (args) => {
    const newTaskList = args[0];
    const project = args[1];

    projects[project] = { tasks: newTaskList };
  });

  EventAggregator.subscribe('projectCreated', (projectObj) => {
    projects[projectObj.title] = projectObj;
    updateStorage();
  });

  EventAggregator.subscribe('taskCreated', () => {
    updateStorage();
  });

  EventAggregator.subscribe('projectDeleted', (project) => {
    delete projects[project.title];
    updateStorage();
  });

  EventAggregator.subscribe('taskDeleted', () => {
    updateStorage();
  });

  function updateProject(projectName, updatedProject) {
    if (projectName === updatedProject.title) {
      projects[projectName] = updatedProject;
    } else {
      delete projects[projectName];
      projects[updatedProject.title] = updatedProject;
    }

    updateStorage();
  }

  EventAggregator.subscribe('projectUpdated', ([projectName, updatedProject]) => {
    updateProject(projectName, updatedProject);
  });

  EventAggregator.subscribe('taskUpdated', () => {
    updateStorage();
  });

  function completeProject(project) {
    completed.projects[project.title] = project;

    project.deleteProject();
  }

  EventAggregator.subscribe('projectCompleted', (project) => {
    completeProject(project);
  });

  EventAggregator.subscribe('taskCompleted', (args) => {
    const task = args[0];
    const project = args[1];

    task.project = project;

    completed.tasks[task.title] = task;

    setTimeout(() => {
      updateStorage();
    }, 75);
  });

  EventAggregator.subscribe('clearHistory', () => {
    completed.projects = {};

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

  function filter(options, ary) {
    let result;
    if (options) {
      if (options.byName) {
        result = ary.filter((project) => project.title === options.byName);
      }
    } else return ary;
    return result || [];
  }

  function sort(options, ary) {
    let result;
    if (options) {
      if (options.byName) {
        result = ary.sort((a, b) => {
          const aTitle = [...a.title];
          const bTitle = [...b.title];

          let sortResult;
          if (options.byName === 'desc') {
            // FIX ME - Need clean alternative to nested ternary
            // eslint-disable-next-line no-nested-ternary
            sortResult = aTitle === bTitle ? 0 : aTitle < bTitle ? -1 : 1;
          }
          if (options.byName === 'asc') {
            // FIX ME - Need clean alternative to nested ternary
            // eslint-disable-next-line no-nested-ternary
            sortResult = aTitle === bTitle ? 0 : aTitle > bTitle ? -1 : 1;
          }

          return sortResult;
        });
      }
    } else return ary;
    return result;
  }

  function getList(list, options) {
    let result;
    if (list === 'projects') {
      result = Object.values(projects);
    } else if (list === 'completedProjects') {
      result = Object.values(completed.projects);
    } else if (list === 'completedTasks') {
      result = Object.values(completed.tasks);
    }

    return sort(options.sort, filter(options.filter, result));
  }

  EventAggregator.subscribe('requestProjects', (options) => {
    const result = getList('projects', options);

    if (options.token) result.token = options.token;

    EventAggregator.publish('projectsReceipt', result);
  });

  EventAggregator.subscribe('requestCompletedTasks', (options) => {
    const result = getList('completedTasks', options);

    if (options.token) result.token = options.token;

    EventAggregator.publish('completedTasksReceipt', result);
  });

  EventAggregator.subscribe('requestCompletedProjects', (options) => {
    const result = getList('completedProjects', options);

    if (options.token) result.token = options.token;

    EventAggregator.publish('completedProjectsReceipt', result);
  });

  return { initStorage };
})());

export default Database;
