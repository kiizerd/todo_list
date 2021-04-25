import Generator from '../generator';
import { EventAggregator, Token } from '../events/events';

const Display = ((function iife() {
  function getCardTasksContent(project) {
    function getAddTaskBtn() {
      const btn = document.createElement('button');
      btn.classList.add('circular', 'ui', 'icon', 'green', 'button');
      btn.classList.add('inverted', 'add-task-btn');

      btn.onclick = () => {
        EventAggregator.publish('primeProject', project.title);
        EventAggregator.publish('newTaskClicked', btn);
      };
      const icon = document.createElement('i');
      icon.classList.add('plus', 'icon');
      btn.append(icon);
      return btn;
    }
    function getTaskList() {
      function getItemMessage(itemTask) {
        const task = itemTask;
        const itemMessage = document.createElement('div');
        itemMessage.classList.add('ui', 'message');
        itemMessage.textContent = task.title;

        if (task.priority === 0) itemMessage.classList.add('error');
        if (task.priority === 1) itemMessage.classList.add('info');
        if (task.priority === 2) itemMessage.classList.add('positive');

        return itemMessage;
      }

      function getItemContent(task) {
        const itemContent = document.createElement('div');
        itemContent.classList.add('content');

        const itemMessage = getItemMessage(task);

        itemContent.append(itemMessage);
        return itemContent;
      }

      function getListItem(task) {
        const item = document.createElement('div');
        item.classList.add('item');

        const itemContent = getItemContent(task);
        item.append(itemContent);

        return item;
      }

      const list = document.createElement('div');
      list.id = `${project.title}-project-card-task-list`;
      list.classList.add('ui', 'inverted', 'relaxed', 'divided', 'list', 'project-card-task-list');
      project.tasks.forEach((task) => {
        const item = getListItem(task);
        list.append(item);
      });

      return list;
    }

    const tasksContent = document.createElement('div');
    tasksContent.classList.add('content');

    const tasksSegment = document.createElement('div');
    tasksSegment.classList.add('ui', 'grey', 'inverted', 'segment');

    if (project.tasks && project.tasks.length) tasksSegment.append(getTaskList());
    tasksSegment.append(getAddTaskBtn());

    tasksContent.append(tasksSegment);

    return tasksContent;
  }

  function fillCard(cardElem, project) {
    const card = cardElem;
    card.header.textContent = project.title;
    card.header.onclick = () => {
      const content = document.getElementById('content');
      content.setActivePage(project.title);
    };

    card.header.classList.add('project-card-title');

    function getBtnClickEvents() {
      Array.from(card.buttons.children).forEach((btnElem) => {
        const btn = btnElem;
        btn.masterObject = card;
      });

      card.completeSelf = function completeCard() {
        project.completeProject();
        card.remove();
      };

      card.editSelf = function editCard() {
        EventAggregator.publish('editProjectClicked', project.title);
      };

      card.deleteSelf = function deleteCard() {
        project.deleteProject();
        card.remove();
      };
    }

    function getCardPriority() {
      const { priority } = project;

      const div = document.createElement('div');
      div.classList.add('project-priority');
      div.textContent = 'Priority: ';

      const span = document.createElement('span');
      if (priority === 1) {
        span.classList.add('ui', 'error', 'text');
        span.textContent = 'High';
      } else if (priority === 2) {
        span.classList.add('ui', 'info', 'text');
        span.textContent = 'Normal';
      } else if (priority === 3) {
        span.classList.add('ui', 'success', 'text');
        span.textContent = 'Low';
      }

      div.append(span);

      return div;
    }

    function getCardDatesContent() {
      const datesContent = document.createElement('div');
      datesContent.classList.add('content');

      const { dates } = project;

      const div = Generator.createSegment();

      const dateStarted = document.createElement('p');
      dateStarted.textContent = `Started on: ${dates.started}`;

      const dueDate = document.createElement('p');
      dueDate.textContent = `Due by: ${dates.due}`;

      if (dates.started) div.append(dateStarted);
      if (dates.due) div.append(dueDate);

      datesContent.append(div);

      return datesContent;
    }

    getBtnClickEvents();

    card.desc.textContent = project.description;

    card.meta.append(getCardPriority());

    card.dates = getCardDatesContent();

    card.tasks = getCardTasksContent(project);

    card.append(card.dates, card.tasks);
  }

  function createProjectCard(project) {
    const card = Generator.createProjectCard();
    card.classList.add('homepage-project-card');
    fillCard(card, project);

    return card;
  }

  function getAddProjectBtn() {
    const animBtn = document.createElement('div');
    animBtn.classList.add('ui', 'animated', 'fade', 'button', 'secondary');
    animBtn.classList.add('new-project-btn', 'right', 'floated');
    animBtn.id = 'homepage-new-project-btn';

    const visibleBtn = document.createElement('div');
    visibleBtn.classList.add('visible', 'content');
    visibleBtn.textContent = 'New project';

    const hiddenBtn = document.createElement('div');
    hiddenBtn.classList.add('hidden', 'content');

    const newProjectIcon = document.createElement('i');
    newProjectIcon.classList.add('plus', 'square', 'outline', 'icon');

    hiddenBtn.append(newProjectIcon);

    animBtn.onclick = () => EventAggregator.publish('newProjectClicked', animBtn);

    animBtn.append(visibleBtn, hiddenBtn);

    return animBtn;
  }

  function getProjectCards() {
    const projectList = [];
    const cardList = [];
    const requestToken = new Token('requestProjects', 'displayHome');
    const projectsReceiptHandler = (projects) => {
      if (projects.token && !(projects.token === requestToken)) return false;
      projectList.length = 0;
      projects.forEach((project) => projectList.push(project));
      for (let i = 0; i < projectList.length; i += 1) {
        const card = createProjectCard(projectList[i]);
        cardList.push(card);
      }
      return null;
    };

    EventAggregator.subscribe('projectsReceipt', projectsReceiptHandler);
    const requestObj = {
      sort: {
        byName: 'desc',
      },
      token: requestToken,
    };
    EventAggregator.publish('requestProjects', requestObj);

    return cardList;
  }

  function getHomePage() {
    function getProjectsContainer() {
      function getColumn() {
        const column = document.createElement('div');
        column.classList.add('column');
        column.style.display = 'flex';
        column.style.flexDirection = 'column';
        column.style.alignItems = 'center';

        return column;
      }

      function getDemoProjectBtn() {
        function demoProjects() {
          EventAggregator.publish('createProject', {
            title: 'General',
            description: 'A non-specific list of generic tasks.',
            priority: 2,
            dates: {
              started: '',
              due: '',
            },
          });
          EventAggregator.publish('createProject', {
            title: 'Work',
            description: 'Tasks that need to be completed for your job.',
            priority: 0,
            dates: {
              started: '',
              due: new Date(2021, 4, 20),
            },
          });
          EventAggregator.publish('createProject', {
            title: 'House',
            description: 'A list of household chores and duties.',
            priority: 1,
            dates: {
              started: '',
              due: '',
            },
          });
        }

        const btn = $('<div></div>');
        btn.addClass('ui secondary left floated button')
          .attr('id', 'demo-project-btn')
          .text('Demo projects')
          .on('click', () => { demoProjects(); });
        return btn;
      }

      const div = document.createElement('div');
      div.classList.add('ui', 'relaxed', 'centered', 'stackable', 'three', 'column', 'grid');
      div.id = 'projects-container';
      const projectCards = getProjectCards();
      projectCards.forEach((card) => {
        const column = getColumn();
        column.append(card);

        div.append(column);
      });

      setTimeout(() => {
        if (!projectCards.length) {
          $(div).append(
            $('<img></img>').attr({
              src: 'https://raw.githubusercontent.com/kiizerd/todo_list/main/media/storage_empty.png',
              type: 'png',
            })
              .css({ margin: '2rem auto 2rem auto' }),
          );

          $(div).parent().append(getDemoProjectBtn());
        }
      }, 375);
      return div;
    }
    const homepage = document.createElement('div');
    const div = getProjectsContainer();
    const addProjectBtn = getAddProjectBtn();
    homepage.classList.add('ui', 'container');
    homepage.id = 'homepage';
    homepage.append(div, addProjectBtn);
    return homepage;
  }

  return { getHomePage };
})());

const { getHomePage } = Display;

export default getHomePage;
