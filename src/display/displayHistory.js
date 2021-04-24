import { EventAggregator, Token } from '../events/events';
import Generator from '../generator';

const History = ((function iife() {
  let completedProjects;

  const projectsToken = new Token('completedProjectsReceipt', 'displayHistory');
  EventAggregator.subscribe('completedProjectsReceipt', (result) => {
    if (result.token && (result.token === projectsToken)) {
      completedProjects = result;
    }
  });

  function getCompletedProjects() {
    EventAggregator.publish('requestCompletedProjects', {
      options: {
        sort: {
          byName: 'desc',
        },
      },
      token: projectsToken,
    });

    return completedProjects;
  }

  let completedTasks;

  const tasksToken = new Token('completedTasksReceipt', 'displayHistory');
  EventAggregator.subscribe('completedTasksReceipt', (result) => {
    if (result.token && (result.token === tasksToken)) {
      completedTasks = result;
    }
  });

  function getCompletedTasks() {
    EventAggregator.publish('requestCompletedTasks', {
      options: {
        sort: {
          byName: 'desc',
        },
      },
      token: tasksToken,
    });

    return completedTasks;
  }

  function getTable() {
    // eslint-disable-next-line no-unused-vars
    const tasks = getCompletedTasks();
    const projects = getCompletedProjects();

    const table = Generator.createTable();

    function fillTable() {
      const tableBody = table.body;

      projects.forEach((project) => {
        const row = document.createElement('tr');

        const rowTitle = document.createElement('td');
        rowTitle.classList.add('center', 'aligned');
        rowTitle.textContent = project.title;

        function getPriority() {
          const priority = document.createElement('td');
          if (project.priority === 1) priority.textContent = 'High';
          else if (project.priority === 2) priority.textContent = 'Normal';
          else if (project.priority === 3) priority.textContent = 'Low';

          return priority;
        }

        const rowPriority = getPriority();

        const rowDesc = document.createElement('td');
        rowDesc.textContent = project.description;
        rowDesc.classList.add('center', 'aligned');

        const rowStarted = document.createElement('td');
        rowStarted.classList.add('right', 'aligned');
        rowStarted.textContent = project.dates.started;

        const rowDue = document.createElement('td');
        rowDue.classList.add('right', 'aligned');
        if (project.dates.due) {
          rowDue.textContent = project.dates.due;
        } else {
          rowDue.textContent = 'N/A';
        }

        row.append(rowTitle, rowPriority, rowDesc, rowStarted, rowDue);

        tableBody.append(row);
      });
    }

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
        .on('click', () => {
          $(this)
            .closest('.message')
            .transition('fade');
        });

      return message;
    }

    if (projects.length > 0) {
      fillTable(projects);

      if (projects.length === 1) {
        table.footer
          .lastChild
          .lastChild.textContent = '1 project completed';
      } else {
        table.footer
          .lastChild
          .lastChild.textContent = `${projects.length} projects completed`;
      }
    } else {
      const row = document.createElement('tr');
      const prompt = getEmptyTablePrompt();

      row.append(prompt);

      table.body.append(row);
    }

    return table;
  }

  function getClearHistoryBtn() {
    const btn = document.createElement('div');
    $(btn).addClass('ui animated fade button secondary right floated')
      .css({ margin: '1rem auto 2rem auto' })
      .append(
        $('<div></div>').addClass('visible content').text('Clear history'),
        $('<div></div>').addClass('hidden content').append(
          $('<i></i>').addClass('trash alternate outline icon'),
        ),
      )
      .on('click', () => {
        $('body')
          .toast({
            message: 'Clear your history of completed projects? This action is irreverisble.',
            class: 'warning',
            position: 'top center',
            displayTime: 3000,
            showProgress: 'left',
            classActions: 'vertical',
            classProgress: 'red',
            actions: [{
              text: 'Confirm',
              class: 'blue',
              click: () => {
                EventAggregator.publish('clearHistory', {});
              },
            }, {
              icon: 'ban',
              class: 'icon red',
            }],
          });
      });

    return btn;
  }

  function getHistoryPage() {
    const page = document.createElement('div');
    page.classList.add('ui', 'container');

    const table = getTable();

    const clearHistoryBtn = getClearHistoryBtn();

    page.append(table, clearHistoryBtn);

    return page;
  }

  return { getHistoryPage };
})());

const { getHistoryPage } = History;

export default getHistoryPage;
