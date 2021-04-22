import { EventAggregator, Token } from "../events";
import { Generator } from "../generator";

const Display = (function() {

  let projects;

  const projectsToken = new Token('completedProjectsReceipt', 'displayHistory');
  EventAggregator.subscribe('completedProjectsReceipt', result => {
    if (result._token && (result._token === projectsToken)) {
      projects = result;
    };
  });

  function getCompletedProjects() {

    EventAggregator.publish('requestCompletedProjects', {
      options: {
        sort: {
          byName: 'desc'
        }
      },
      _token: projectsToken
    });

    return projects
  };

  let tasks;

  const tasksToken = new Token('completedTasksReceipt', 'displayHistory');
  EventAggregator.subscribe('completedTasksReceipt', result => {
    if (result._token && (result._token === tasksToken)) {
      tasks = result;
    };
  });

  function getCompletedTasks() {

    EventAggregator.publish('requestCompletedTasks', {
      options: {
        sort: {
          byName: 'desc'
        }
      },
      _token: tasksToken
    });

    return tasks
  };

  function getTable() {
    const tasks = getCompletedTasks();
    const projects = getCompletedProjects();

    const table = Generator.createTable();

    if (projects.length > 0) {
      fillTable(projects);
  
      
      if (projects.length === 1) {
        table.footer
          .lastChild
          .lastChild.textContent = '1 project completed';
      } else {
        table.footer
          .lastChild
          .lastChild.textContent = projects.length + ' projects completed';
      }
    } else {
      const row = document.createElement('tr');
      const prompt = getEmptyTablePrompt();

      row.append(prompt);

      table.body.append(row);
    }

    return table

    function fillTable() {
      const tableBody = table.body

      for (const project of projects) {
        const row = document.createElement('tr');

        const rowTitle = document.createElement('td');
        rowTitle.classList.add('center', 'aligned');
        rowTitle.textContent = project.title;

        const rowPriority = getPriority();

        const rowDesc = document.createElement('td');
        rowDesc.textContent = project.description;

        const rowStarted = document.createElement('td');
        rowStarted.classList.add('right',  'aligned');
        rowStarted.textContent = project.dates.started;

        const rowDue = document.createElement('td');
        rowDue.classList.add('right',  'aligned');
        rowDue.textContent = project.dates.due;

        row.append(rowTitle, rowPriority, rowDesc, rowStarted, rowDue);

        tableBody.append(row);

        function getPriority() {
          const priority = document.createElement('td');
          priority.textContent = project.priority === 0 ? 'High' :
                                 project.priority === 1 ? 'Normal' : 'Low';

          return priority;
        }
      };
    };

    function getEmptyTablePrompt() {
      const message = document.createElement('div');
      message.classList.add('ui', 'info', 'message');
      
      const icon = document.createElement('i');
      icon.classList.add('close', 'icon');

      const header = document.createElement('div');
      header.classList.add('header');
      header.textContent = 'History table empty';

      const para = document.createElement('p');
      para.textContent = 'Complete a project to see it appear here.';

      message.append(icon, header, para);

      $(icon)
        .on('click', function() {
          $(this)
            .closest('.message')
            .transition('fade')
          ;
        })
      ;

      return message
    };
  };

  return { getTable }
})()

const getHistoryPage = Display.getTable

export { getHistoryPage }