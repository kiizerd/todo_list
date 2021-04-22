import { Generator } from '../generator';
import { EventAggregator, Token } from '../events';

const Display = (function() {


  function getHomePage() {
    const homepage = document.createElement('div');
    homepage.classList.add('ui', 'container');
    homepage.id = 'homepage';
    
    const div = getProjectsContainer();
    
    const addProjectBtn = getAddProjectBtn()
    
    homepage.append(div, addProjectBtn);    
    
    return homepage;

    function getProjectsContainer() {
      const div = document.createElement('div');
      div.classList.add('ui', 'relaxed', 'centered', 'stackable', 'three', 'column', 'grid');
      div.id = 'projects-container';
      
      const projectCards = getProjectCards();
      
      for (const card of projectCards) {
        const column = getColumn();
        
        column.append(card);

        div.append(column);
      };

      return div

      function getColumn() {
        const column = document.createElement('div');
        column.classList.add('column');
        column.style.display = 'flex';
        column.style.flexDirection = 'column';
        column.style.alignItems = 'center';

        return column
      }
    }

  };

  function getProjectCards(options) {
    const projectList = [];
    const cardList = [];
    
    const requestToken = new Token('requestProjects', 'displayHome');
    
    const projectsReceiptHandler = function(projects) {
      if (projects._token && !(projects._token === requestToken)) return false
      projectList.length = 0;
      
      projects.forEach(project => projectList.push(project));
      
      for (let i = 0; i < projectList.length; i++) {
        let card = createProjectCard(projectList[i]);
        cardList.push(card);
      };
      
    };

    EventAggregator.subscribe('projectsReceipt', projectsReceiptHandler);
    
    const requestObj = {
      sort: {
        byName: 'desc'
      },
      _token: requestToken
    };
    
    EventAggregator.publish('requestProjects', requestObj);

    return cardList
  }

  function createProjectCard(project) {
    const card = Generator.createProjectCard();
    card.classList.add('homepage-project-card');
    fillCard(card, project);

    return card
  };

  function fillCard(card, project) {
    card.header.textContent = project.title;
    card.header.onclick = () => {
      const content = document.getElementById('content');
      content.setActivePage(project.title);
    };
    
    card.header.classList.add('project-card-title');

    getBtnClickEvents();

    card.desc.textContent = project.description;
    
    card.meta.append(getCardPriority());

    card.dates = getCardDatesContent();    
    
    card.tasks = getCardTasksContent(project);

    card.append(card.dates, card.tasks);

    function getBtnClickEvents() {
      for (const btn of Array.from(card.buttons.children)) {
        btn.masterObject = card;
      }

      card.completeSelf = function() {
        project.completeProject();
        card.remove();
      };

      card.editSelf = function() {

        EventAggregator.publish('editProjectClicked', project.title);

      };

      card.deleteSelf = function() {
        project.deleteProject();
        card.remove();
      };
    };

    function getCardPriority() {
      const priority = project.priority;

      const div = document.createElement('div');
      div.classList.add('project-priority',);
      div.textContent = 'Priority: '

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

      div.append(span)

      return div
    };

    function getCardDatesContent() {
      const datesContent = document.createElement('div');
      datesContent.classList.add('content');

      const dates = project.dates;

      const div = Generator.createSegment();

      const dateStarted = document.createElement('p');
      dateStarted.textContent = 'Started on: ' + dates.started;

      const dueDate = document.createElement('p');
      dueDate.textContent = 'Due by: ' + dates.due;

      if (dates.started) div.append(dateStarted);
      if (dates.due) div.append(dueDate);

      datesContent.append(div)

      return datesContent
    };
  };

  function getCardTasksContent(project) {
    const tasksContent = document.createElement('div');
    tasksContent.classList.add('content');

    const tasksSegment = document.createElement('div');
    tasksSegment.classList.add('ui', 'grey', 'inverted', 'segment');

    if (project.tasks && project.tasks.length) tasksSegment.append(getTaskList());
    tasksSegment.append(getAddTaskBtn());

    tasksContent.append(tasksSegment);

    return tasksContent
    
    function getTaskList() {
      const list = document.createElement('div');
      list.id = project.title + '-project-card-task-list'; 
      list.classList.add('ui', 'inverted', 'relaxed', 'divided', 'list',
                         'project-card-task-list');


      for (const task of project.tasks) {
        const item = getListItem(task);
        list.append(item);
      }

      return list;
  
      function getListItem(task) {
        const item = document.createElement('div');
        item.classList.add('item');

        const itemContent = getItemContent()

        item.append(itemContent);

        return item

        function getItemContent() {
          const itemContent = document.createElement('div');
          itemContent.classList.add('content');

          const itemMessage = getItemMessage();

          itemContent.append(itemMessage);
          
          return itemContent
        }
  
        function getItemMessage() {
          const itemMessage = document.createElement('div');
          itemMessage.classList.add('ui', 'message');
          itemMessage.textContent = task.title;
  
          if (task.priority === 0) itemMessage.classList.add('error');
          if (task.priority === 1) itemMessage.classList.add('info');
          if (task.priority === 2) itemMessage.classList.add('positive');
  
          return itemMessage;
        };

      };
  
    };
    
    function getAddTaskBtn() {
      const btn = document.createElement('button');
      btn.classList.add('circular', 'ui' ,'icon', 'green', 'button');
      btn.classList.add('inverted', 'add-task-btn');

      btn.onclick = () => {
        EventAggregator.publish('primeProject', project.title);
        EventAggregator.publish('newTaskClicked', btn);
      };
      
      const icon = document.createElement('i');
      icon.classList.add('plus', 'icon');
      
      btn.append(icon);
      
      return btn
    };

  };

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

    return animBtn
  };
  
  return { getHomePage }
})()

const getHomePage = Display.getHomePage;

export { getHomePage }
