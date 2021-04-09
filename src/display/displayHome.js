import { Generator } from '../generator';
import { EventAggregator } from '../events';

const Display = (function() {

  
  function getHomePage() {
    const homepage = document.createElement('div');
    homepage.classList.add('container');
    homepage.id = 'homepage';
    
    const div = getProjectsContainer();
    
    const addProjectBtn = getAddProjectBtn()
    
    homepage.append(div, addProjectBtn);
    
    
    return homepage;
    function getProjectsContainer() {
      const div = document.createElement('div');
      div.classList.add('ui', 'inverted', 'stackable', 'three', 'cards');
      div.id = 'projects-container';
      
      const projectCards = getProjectCards();
      
      for (const card of projectCards) {
        div.append(card);
      }       
      
      EventAggregator.subscribe('projectCreated', newProject => {
        let newCard = createProjectCard(newProject);
        div.append(newCard);
        console.log('im working');
      });

      return div
    }

  }

  function getProjectCards(options) {
    const projectList = [];
    const cardList = [];
        
    EventAggregator.subscribe('projectsReceipt', projects => {
      // reset local list to guarantee most up to date information
      projectList.length = 0;

      projects.forEach(project => projectList.push(project));

      for (let i = 0; i < projectList.length; i++) {
        let card = createProjectCard(projectList[i]);
        cardList.push(card);
      };
    });

    
    EventAggregator.publish('requestProjects', options ? options : {
      sort: 'default',
      filter: 'default'
    });

    return cardList
  }

  function createProjectCard(project) {
    const card = Generator.createCard();
    card.classList.add('homepage-project-card');
    fillCard(card, project);

    return card
  }

  function fillCard(card, project) {
    card.header.textContent = project.title;

    card.desc.textContent = project.description;
    
    card.meta.append(getCardPriority())

    card.dates = getCardDatesContent();    
    
    card.tasks = getCardTasksContent(project);

    card.append(card.dates, card.tasks);
      

    function getCardPriority() {
      const priority = project.priority;

      const div = document.createElement('div');
      div.classList.add('project-priority',);
      div.textContent = 'Priority: '

      const span = document.createElement('span');
      if (priority === 0) {
        span.classList.add('ui', 'error', 'text');
        span.textContent = 'High';
      } else if (priority === 1) {
        span.classList.add('ui', 'info', 'text');
        span.textContent = 'Normal';
      } else if (priority === 2) {
        span.classList.add('ui', 'success', 'text');
        span.textContent = 'Low';
      }

      div.append(span)

      return div
    }

    function getCardDatesContent() {
      const datesContent = document.createElement('div');
      datesContent.classList.add('content');

      const dates = project.dates;

      const div = document.createElement('div');
      div.classList.add('ui', 'grey', 'inverted', 'segment');

      const dateStarted = document.createElement('p');
      dateStarted.textContent = 'Started on: ' + dates.started;

      const dueDate = document.createElement('p');
      dueDate.textContent = 'Due by: ' + dates.due;

      div.append(dateStarted, dueDate);

      datesContent.append(div)

      return datesContent
    }
  }  

  function getCardTasksContent(project) {
    const tasksContent = document.createElement('div');
    tasksContent.classList.add('content');

    const tasks = project.tasks;

    const div = document.createElement('div');
    div.classList.add('ui', 'grey', 'inverted', 'segment');
    
    const taskList = getTaskList();
    
    const addTaskBtn = getAddTaskBtn();

    div.append(taskList, addTaskBtn);

    tasksContent.append(div);

    return tasksContent
    
    function getTaskList() {
      const list = document.createElement('div');
      list.classList.add('ui', 'inverted', 'relaxed', 'divided', 'list');
    
      fillTaskList(list);

      return list;

      // temporarily fills project with mock tasks if project taskList is empty
      function fillTaskList() {
        if (tasks) {
          console.log('tasks', tasks)
          list.append(
            getListItem({
              title: 'task 1',
              priority: 0
            }),
            getListItem({
              title: 'task2',
              priority: 1
            }),
            getListItem({
              title: 'task3',
              priority: 2
            })
          );
  
        } else {
          for (const task of tasks) {
            let listItem = getListItem(task);
            list.append(listItem);
          };
        };
      };
  
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
      btn.classList.add('circular', 'ui' ,'icon', 'button');
      btn.classList.add('project-card-add-task-btn', 'add-task-btn');
      
      const icon = document.createElement('i');
      icon.classList.add('plus', 'icon');
      
      btn.append(icon);
      
      return btn;
    };

  }

  function getAddProjectBtn() {
    const btn = document.createElement('button');
    btn.classList.add('ui', 'secondary', 'button');
    btn.classList.add('new-project-btn');
    btn.id = 'homepage-new-project-btn';
    btn.textContent = 'New Project';

    btn.onclick = () => EventAggregator.publish('newProjectClicked', btn);

    return btn
  }
  
  return { getHomePage }
})()

const getHomePage = Display.getHomePage;

export { getHomePage }