import { EventAggregator, Token } from '../events/events';
import Generator from '../generator';

const Project = ((function iife() {
  const requestToken = new Token('requestProject', 'displayProject');

  const result = { project: '' };

  const projectsReceiptHandler = (projects) => {
    if (projects.token && !(projects.token === requestToken)) return false;
    [result.project] = projects;

    return null;
  };

  EventAggregator.subscribe('projectsReceipt', projectsReceiptHandler);

  function getProject(projectName) {
    const requestObj = {
      filter: {
        byName: projectName,
      },
      token: requestToken,
    };

    EventAggregator.publish('requestProjects', requestObj);

    return result.project;
  }

  function getProjectPage(projectName) {
    const projectPage = Generator.createProjectPage();
    const { segment } = projectPage;
    const project = getProject(projectName);

    function getTaskCard(task) {
      const card = Generator.createTaskCard();

      function fillTaskCard(cardTask) {
        this.header.textContent = cardTask.title;

        this.desc.textContent = cardTask.description;

        function getBtnClickEvents() {
          Array.from(this.buttons.children).forEach((btnElem) => {
            const btn = btnElem;
            btn.masterObject = this;
          });

          this.completeSelf = () => {
            project.completeTask(this.cardTask.title);
            this.remove();
          };

          this.editSelf = () => {
            EventAggregator.publish('editTaskClicked', [
              this.cardTask.title,
              project.title,
            ]);
          };

          this.deleteSelf = () => {
            project.removeTask(this.cardTask.title);
            this.remove();
          };
        }

        getBtnClickEvents.bind(this).call();

        function getCardPriority() {
          const { priority } = cardTask;

          const div = document.createElement('div');
          div.classList.add('task-priority');
          div.textContent = 'Priority: ';

          const span = document.createElement('span');
          let priorityClass;
          let priorityText;
          if (priority === 3) {
            priorityClass = 'success';
            priorityText = 'Low';
          } else if (priority === 2) {
            priorityClass = 'info';
            priorityText = 'Normal';
          } else if (priority === 1) {
            priorityClass = 'error';
            priorityText = 'High';
          }

          span.classList.add(priorityClass, 'ui', 'text');
          span.textContent = priorityText;

          div.append(span);

          return div;
        }

        this.meta.append(getCardPriority());

        function getCardDatesContent() {
          const datesContent = document.createElement('div');
          datesContent.classList.add('content');

          const { dates } = cardTask;

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

        this.dates = getCardDatesContent();

        this.task = cardTask;

        this.append(this.dates);
      }

      fillTaskCard.call(card, task);

      return card;
    }

    function fillProject() {
      segment.heading.textContent = project.title;

      function getBtnClickEvents() {
        projectPage.header = segment.heading;
        Array.from(projectPage.buttons.children).forEach((btnElem) => {
          const btn = btnElem;
          btn.masterObject = projectPage;
        });

        const content = document.getElementById('content');

        projectPage.completeSelf = () => {
          project.completeProject();
          projectPage.remove();

          content.setActivePage('home');
        };

        projectPage.editSelf = () => {
          EventAggregator.publish('editProjectClicked', project.title);
        };

        projectPage.deleteSelf = () => {
          project.deleteProject();
          projectPage.remove();

          content.setActivePage('home');
        };
      }

      getBtnClickEvents();

      function fillPriority() {
        const { priority } = project;
        const prioritySpan = segment.priority;
        let priorityClass;
        let priorityText;
        if (priority === 3) {
          priorityClass = 'success';
          priorityText = 'Low';
        } else if (priority === 2) {
          priorityClass = 'info';
          priorityText = 'Normal';
        } else if (priority === 1) {
          priorityClass = 'error';
          priorityText = 'High';
        }

        prioritySpan.classList.add(priorityClass, 'ui', 'text');
        prioritySpan.textContent = priorityText;
      }

      fillPriority();

      function fillDates() {
        const { dates } = project;

        function getDateSegment(date) {
          const dateSegment = document.createElement('div');
          dateSegment.classList.add('ui', 'inverted', 'segment');
          dateSegment.classList.add('center', 'aligned');

          const span = document.createElement('span');
          if (date === 'started') {
            span.textContent = `Started on: ${dates.started}`;
          } else if (date === 'due') {
            span.textContent = `Due by: ${dates.due}`;
          }

          dateSegment.append(span);

          return dateSegment;
        }

        const startDateSegment = getDateSegment('started');

        if (dates.due) {
          const datesWrapper = document.createElement('div');
          const dueDateSegment = getDateSegment('due');
          datesWrapper.classList.add('ui', 'horizontal', 'segments');

          datesWrapper.append(startDateSegment, dueDateSegment);

          segment.dates.append(datesWrapper);
        } else {
          segment.dates.append(startDateSegment);
        }
      }

      fillDates();

      function fillDescription() {
        const desc = project.description;
        const descSegment = segment.desc;
        descSegment.classList.remove('inverted');
        descSegment.textContent = desc;
      }

      fillDescription();

      function fillTasks() {
        const { tasks } = project;
        const tasksSegment = segment.tasks;
        tasksSegment.id = 'project-card-task-segment';

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

        const addTaskBtn = getAddTaskBtn();

        tasksSegment.parentElement.append(addTaskBtn);

        function getNoTaskMsg() {
          const span = document.createElement('span');
          span.classList.add('black', 'ui', 'text');
          span.textContent = 'This project has no tasks. Add one with the button below.';

          return span;
        }

        function getTaskCardColumn(task) {
          const column = document.createElement('div');
          column.classList.add('column');

          const taskCard = getTaskCard(task);

          column.append(taskCard);

          return column;
        }

        function fillTaskList() {
          tasksSegment.classList.add('two', 'column', 'stackable', 'grid');
          const taskList = project.tasks;

          taskList.forEach((task) => {
            const taskCardColumn = getTaskCardColumn(task);

            tasksSegment.append(taskCardColumn);
          });
        }

        if (!tasks.length) {
          const noTaskMsg = getNoTaskMsg();

          tasksSegment.append(noTaskMsg);
        } else {
          fillTaskList();
        }
      }

      fillTasks();
    }

    projectPage.fill = fillProject;

    fillProject();

    return projectPage;
  }

  return { getProjectPage };
})());

export default Project;
