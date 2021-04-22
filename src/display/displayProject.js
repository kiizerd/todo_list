import { EventAggregator, Token } from '../events';
import { Generator } from '../generator';

const Display = (function() {
  const requestToken = new Token('requestProject', 'displayProject');
  
  const result = { project: '' }

  const projectsReceiptHandler = function(projects) {
    if (projects._token && !(projects._token === requestToken)) return false
    result.project = projects[0];
  };

  EventAggregator.subscribe('projectsReceipt', projectsReceiptHandler);

  function getProject(projectName) {

    const requestObj = {
      filter: {
        byName: projectName
      },
      _token: requestToken
    };

    EventAggregator.publish('requestProjects', requestObj);  
    
    return result.project
  };

  function getProjectPage(projectName) {
    const projectPage = Generator.createProjectPage();
    const segment = projectPage.segment;
    const project = getProject(projectName);

    projectPage.fill = fillProject;

    fillProject();
    
    return projectPage

    function fillProject() {
      segment.heading.textContent = project.title;

      getBtnClickEvents();

      fillPriority();
      fillDates();
      fillDescription();
      fillTasks();

      function getBtnClickEvents() {
        projectPage.header = segment.heading
        for (const btn of Array.from(projectPage.buttons.children)) {
          btn.masterObject = projectPage;
        }

        const content = document.getElementById('content');

        projectPage.completeSelf = function() {
          project.completeProject();
          projectPage.remove();

          content.setActivePage('home');
        };

        projectPage.editSelf = function() {

          EventAggregator.publish('editProjectClicked', project.title);

        };

        projectPage.deleteSelf = function() {
          project.deleteProject();
          projectPage.remove();

          content.setActivePage('home');
        };
      };
      
      function fillPriority() {
        const priority = project.priority;
        const prioritySpan = segment.priority;
        const priorityClass = priority === 3 ? 'success' : priority === 2 ? 'info' : 'error';
        const priorityText = priority === 3 ? 'Low' : priority === 2 ? 'Normal' : 'High';
        prioritySpan.classList.add(priorityClass, 'ui', 'text');
        prioritySpan.textContent = priorityText;
      };

      function fillDates() {
        const dates = project.dates;
        const startDateSegment = getStartDateSegment();
        
        if (dates.due) {
          const datesWrapper = document.createElement('div');
          const dueDateSegment = getDueDateSegment();
          datesWrapper.classList.add('ui', 'horizontal', 'segments');

          datesWrapper.append(startDateSegment, dueDateSegment);

          segment.dates.append(datesWrapper);
        } else {
          segment.dates.append(startDateSegment);
        };

        // combine these two functions
        function getStartDateSegment() {
          const segment = document.createElement('div');
          segment.classList.add('ui', 'inverted', 'segment');
          segment.classList.add('center', 'aligned');

          const span = document.createElement('span');
          span.textContent = 'Started on: ' + dates.started;

          segment.append(span);

          return segment
        };

        function getDueDateSegment() {
          const segment = document.createElement('div');
          segment.classList.add('ui', 'inverted', 'segment');
          segment.classList.add('center', 'aligned');

          const span = document.createElement('span');
          span.textContent = 'Due by: ' + dates.due;

          segment.append(span);

          return segment
        };

      };

      function fillDescription() {
        const desc = project.description;
        const descSegment = segment.desc;
        descSegment.classList.remove('inverted');
        descSegment.textContent = desc;
      };

      function fillTasks() {
        const tasks = project.tasks;
        const tasksSegment = segment.tasks;
        tasksSegment.id = 'project-card-task-segment';
        const addTaskBtn = getAddTaskBtn();
        
        tasksSegment.parentElement.append(addTaskBtn);
        
        if (!tasks.length) {
          const noTaskMsg = getNoTaskMsg();
          
          tasksSegment.append(noTaskMsg);
        }
        else {
          fillTaskList();
        };
        
        function fillTaskList() {
          tasksSegment.classList.add('two', 'column', 'stackable', 'grid');
          const taskList = project.tasks
          
          for (const task of taskList) {
            const taskCardColumn = getTaskCardColumn(task);
            
            tasksSegment.append(taskCardColumn);
          };
        };
        
        function getTaskCardColumn(task) {
          const column = document.createElement('div');
          column.classList.add('column');

          const taskCard = getTaskCard(task);

          column.append(taskCard);

          return column
        }
    
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

        function getNoTaskMsg() {
          const span = document.createElement('span');
          span.classList.add('black', 'ui', 'text');
          span.textContent = 'This project has no tasks. Add one with the button below.';
          
          return span
        };

      };

    };

    function getTaskCard(task) {
      const card = Generator.createTaskCard();

      fillTaskCard.call(card, task);

      return card;
    };

    function fillTaskCard(task) {
      this.header.textContent = task.title;

      this.desc.textContent = task.description;

      getBtnClickEvents.bind(this).call();

      this.meta.append(getCardPriority());

      this.dates = getCardDatesContent();

      this.task = task;

      this.append(this.dates);
      
      function getBtnClickEvents() {
        for (const btn of Array.from(this.buttons.children)) {
          btn.masterObject = this;
        };
  
        this.completeSelf = function() {
          project.completeTask(this.task.title);
          this.remove();
        };
  
        this.editSelf = function() {
  
          console.log('makin it here chief', this.task);
          EventAggregator.publish('editTaskClicked', [this.task.title, project.title]);
  
        };
  
        this.deleteSelf = function() {
          project.removeTask(this.task.title);
          this.remove();
        };
      };

      function getCardPriority() {
        const priority = task.priority;

        const div = document.createElement('div');
        div.classList.add('task-priority');
        div.textContent = 'Priority: ';

        const span = document.createElement('span');
        const priorityClass = priority === 2 ? 'success' : priority === 1 ? 'info' : 'error';
        const priorityText = priority === 2 ? 'Low' : priority === 1 ? 'Normal' : 'High';
        span.classList.add(priorityClass, 'ui', 'text');
        span.textContent = priorityText;

        div.append(span);

        return div
      };

      function getCardDatesContent() {
        const datesContent = document.createElement('div');
        datesContent.classList.add('content');

        const dates = task.dates;

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

  };

  return { getProjectPage }
})()

const Project = Display

export { Project }