import { Generator } from '../generator';
import { EventAggregator } from '../events';
import { format } from 'date-fns';

const Display = (function() {

  function getHomePage() {
    const div = getProjectsContainer();    

    function getProjectsContainer() {
      const div = document.createElement('div');
      div.classList.add('container-fluid');
      div.classList.add('row', 'row-cols-xs-2', 'row-cols-md-3');
      div.id = 'projects-container';

      return div
    }

    const projectCards = getProjectCards()

    projectCards.forEach(card => {
      div.append(card);
    });

    div.append(getAddProjectBtn());

    return div;
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

    function createProjectCard(project) {
      const card = Generator.createCard()
      fillCard(card, project)
      card.classList.add('project-cards', 'bg-dark', 'text-white',
                         'col-4', 'col-xs-6', 'm-2', 'p-1');

      return card
    }

    return cardList
  }

  function fillCard(card, project) {
    card.header.textContent = project.title;
    fillCardBody(card.body, project);

    function fillCardBody(body, project) {
      body.subtitle = document.createElement('h6');
      body.subtitle.classList.add('card-subtitle', 'p-1');
      body.subtitle.textContent = project.description;

      body.priority = getCardPriority(project.priority);
      body.dates = getCardDates(project.dates);
      body.tasks = getCardTasks(project.tasks);
      
      body.append(body.subtitle, body.priority, body.dates, body.tasks)
    }

    function getCardPriority(priority) {
      const div = document.createElement('div');
      div.classList.add('project-priority', 'text-white-50', 'p-2');
      div.textContent = 'Priority: '

      const span = document.createElement('span');
      if (priority === 0) {
        span.classList.add('text-danger');
        span.textContent = 'High';
      } else if (priority === 1) {
        span.classList.add('text-info');
        span.textContent = 'Normal';
      } else if (priority === 2) {
        span.classList.add('text-success');
        span.textContent = 'Low';
      }

      div.append(span)

      return div
    }

    function getCardDates(dates) {
      const div = document.createElement('div');
      div.classList.add('bg-secondary', 'project-dates-container', 'm-2', 'p-2');

      const dateStarted = document.createElement('p');
      dateStarted.textContent = 'Started on: ' + dates.started;
      dateStarted.classList.add('mb-1')

      const dueDate = document.createElement('p');
      dueDate.textContent = 'Due by: ' + dates.due;
      dueDate.classList.add('mb-1')

      div.append(dateStarted, dueDate);

      return div
    }
  }  

  function getCardTasks(tasks) {
    const div = document.createElement('div');
    div.classList.add('card-tasks-container');
    
    const taskList = getTaskList();
    
    const addTaskBtn = getAddTaskBtn();
    
    function getAddTaskBtn() {
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-secondary', 'btn-small', 'm-2');
      btn.classList.add('add-task-btn-project-card', 'add-task-btn');
      
      const icon = document.createElement('i');
      icon.classList.add('bi', 'bi-plus');
      
      btn.append(icon);
      
      return btn;
    };
    
    function getTaskList() {
      const list = document.createElement('ul');
      list.classList.add('list-group', 'm-2');
    
      fillTaskList(list);

      return list;
    };
    
    function fillTaskList(list) {
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
        tasks.forEach(task => {
          let listItem = getListItem(task)
          list.append(listItem);
        });
      };
    };

    function getListItem(task) {
      const item = document.createElement('li');
      item.classList.add('list-group-item', 'bg-secondary', 'p-1');

      const alert = getAlert()

      function getAlert() {
        const div = document.createElement('div');
        div.classList.add('alert', 'm-0', 'p-1', 'text-center');
        div.textContent = task.title;
        div.role = 'alert';

        if (task.priority === 0) div.classList.add('alert-danger')
        if (task.priority === 1) div.classList.add('alert-info')
        if (task.priority === 2) div.classList.add('alert-success')

        return div
      }

      item.append(alert);

      return item
    }

    div.append(taskList, addTaskBtn);

    return div
  }

  function getAddProjectBtn() {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-dark', 'm-3', 'w-25');
    btn.textContent = 'New Project';
    btn.onclick = () => EventAggregator.publish('newProjectClicked', btn);

    return btn
  }
  
  return { getHomePage }
})()

const getHomePage = Display.getHomePage;

export { getHomePage }