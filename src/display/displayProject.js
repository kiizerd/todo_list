import { EventAggregator, Token } from '../events';
import { Generator } from '../generator';

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('new-project-modal');
    if (!modal) {
      modal = getNewProjectModal();
      document.body.append(modal);
    }

    showModal('project');
  });

  EventAggregator.subscribe('newTaskClicked', () => {
    let modal = document.getElementById('new-task-modal');
    if (!modal) {
      modal = getNewTaskModal()
      document.body.append(modal);
    }
    
    showModal('task');
  });

  function getNewTaskModal() {
    const modal = Generator.createModal();
    modal.id = 'new-task-modal';
    modal.classList.add('tiny');

    modal.header.textContent = 'New Task';

    const modalForm = getNewTaskForm();
    
    modal.content.append(modalForm);

    modalForm.addResetBtn.bind(modalForm).call();

    return modal
  };

  function getNewTaskForm() {
    const form = Generator.createForm();
    form.id = 'new-task-form';
    form.onsubmit = "return false";
    form.reset = resetForm.bind(form);

    return form
  };

  function getNewProjectModal() {
    const modal = Generator.createModal();
    modal.id = 'new-project-modal';
    modal.classList.add('small');

    modal.header.textContent = 'New Project';

    const modalForm = getNewProjectForm();

    modal.content.append(modalForm);
    
    modalForm.addResetBtn.bind(modalForm).call();

    return modal
  };

  function getNewProjectForm() {
    const form = Generator.createForm();
    form.id = 'new-project-form';
    form.onsubmit = "return false";
    form.reset = resetForm.bind(form);

    return form
  };

  function getNewFormData(formName) {
    const formId = 'new-' + `${formName}` + '-form'
    const form = document.forms[formId];
    
    const formData = {
      title: form.elements[0].value,
      priority: form.elements[1].value,
      description: form.elements[2].value,
      dates: {
        started: form.elements[3].value,
        due: form.elements[5].value
      }
    };

    form.reset();
    
    return formData
  };
    
  function resetForm() {
    const formName = this.id === 'new-task-form' ? 'task' : 'project';
    const formModal = this.parentElement;
    formModal.textContent = '';

    const newForm = formName === 'task' ?  getNewTaskForm() : getNewProjectForm();

    formModal.append(newForm);

    $('#new-' + `${formName}` + '-modal #new-form-priority-dropdown')
      .dropdown()
    ;
  };

  function getProjectPage(projectName) {
    const projectPage = Generator.createProjectPage();
    const segment = projectPage.segment;
    const project = getProject();

    fillProject();
    
    return projectPage

    function getProject() {
      const requestToken = new Token('requestProject', 'displayProject');
      
      const result = { project: '' }
  
      const projectsReceiptHandler = function(projects) {
        if (projects._token && !(projects._token === requestToken)) return false
        result.project = projects[0];
      };
  
      EventAggregator.subscribe('projectsReceipt', projectsReceiptHandler);
  
      const requestObj = {
        filter: {
          byName: projectName
        },
        _token: requestToken
      };
  
      EventAggregator.publish('requestProjects', requestObj);  
      
      return result.project
    };

    function fillProject() {
      segment.heading.textContent = project.title;

      fillPriority();
      fillDates();
      fillDescription();
      fillTasks();
      
      function fillPriority() {
        const priority = project.priority;
        const prioritySpan = segment.priority;
        const priorityClass = priority === 2 ? 'success' : priority === 1 ? 'info' : 'error';
        const priorityText = priority === 2 ? 'Low' : priority === 1 ? 'Normal' : 'High';
        prioritySpan.classList.add(priorityClass, 'ui', 'text');
        prioritySpan.textContent = priorityText;
      };

      function fillDates() {
        const dates = project.dates;
        const startDateSegment = getStartDateSegment();
        
        if (dates.due) {
          const datesWrapper = Generator.createSegment();
          const dueDateSegment = getDueDateSegment();
          datesWrapper.classList.remove('segment')
          datesWrapper.classList.add('horizontal', 'basic', 'segments', 'compact');

          datesWrapper.append(startDateSegment, dueDateSegment)

          segment.dates.append(datesWrapper);
        } else {
          segment.dates.append(startDateSegment);
        };

        // combine these two functions
        function getStartDateSegment() {
          const segment = document.createElement('div');
          segment.classList.add('segment', 'compact');
          segment.classList.add('center', 'aligned');

          const span = document.createElement('span');
          span.textContent = 'Started on: ' + dates.started;

          segment.append(span);

          return segment
        };

        function getDueDateSegment() {
          const segment = document.createElement('div');
          segment.classList.add('segment', 'compact');

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
        const addTaskBtn = getAddTaskBtn();
        
        tasksSegment.parentElement.append(addTaskBtn);
        
        if (!tasks.length) {
          const noTaskMsg = getNoTaskMsg();
          
          tasksSegment.append(noTaskMsg);
        }
        else {
          fillTaskList();
        };

        EventAggregator.subscribe('taskCreated', newTask => {
          tasksSegment.textContent = '';
          fillTaskList()            
        });
        
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

      fillTaskCard(card, task);

      return card;
    };

    function fillTaskCard(card, task) {
      card.header.textContent = task.title;

      card.desc.textContent = task.description;

      card.meta.append(getCardPriority());

      card.dates = getCardDatesContent();

      card.append(card.dates);

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

  function showModal(modal) {
    $('#new-' + `${modal}` + '-modal')
      .modal('show')
    ;

    $('#new-' + `${modal}` + '-modal #new-form-priority-dropdown')
      .dropdown()
    ;

    $('.ui.checkbox')
      .checkbox()
    ;

    $('.ui.calendar').calendar({
      type: 'date'
    });
    
    addConfirmClickEvents();
    
    const initToggles = initFormToggles(modal);
    for (const toggle of initToggles) {
      toggle();
    };


    function addConfirmClickEvents() {      
      if (modal === 'project') {
        const projectConfirmBtn = document.querySelector('#new-project-modal .actions .positive');
        projectConfirmBtn.onclick = () => { 
          const formData = getNewFormData('project');
          console.log(formData)
          EventAggregator.publish('createProject', formData);
        };

      } else if (modal === 'task') {
        const taskConfirmBtn = document.querySelector('#new-task-modal .actions .positive');
        taskConfirmBtn.onclick = () => {
          const formData = getNewFormData('task');
          EventAggregator.publish('createTask', formData);
        };
      };

    };

    function initFormToggles(modal) {
      const modalId = '#new-' + `${modal}` + '-modal'
      function initDueDateToggle() {
        const fieldId = '#new-form-dueDateField';
        const toggleId = '#new-form-dueDateToggle';
        const dueDateToggle = document.querySelector(modalId + ' ' + toggleId);
        dueDateToggle.classList.remove('hidden');
        dueDateToggle.onclick = () => {
          const dueDateField = document.querySelector(modalId + ' ' + fieldId);
          if (dueDateToggle.checked) {
            dueDateField.classList.remove('disabled');
          } else {
            dueDateField.classList.add('disabled');
          };
        };
      };

      function initDateStartedToggle() {
        const fieldId = '#new-form-dateStartedField';
        const toggleId = '#new-form-dateStartedToggle';
        const dateStartedToggle = document.querySelector(modalId + ' ' + toggleId);
        dateStartedToggle.classList.remove('hidden');
        dateStartedToggle.onclick = () => {
          const dateStartedField = document.querySelector(modalId + ' ' + fieldId);
          if (dateStartedToggle.checked) {
            dateStartedField.classList.add('disabled');
          } else {
            dateStartedField.classList.remove('disabled');
          };
        };
      };

      return [initDueDateToggle, initDateStartedToggle]
    };
  }

  return { getProjectPage }
})()

const Project = Display

export { Project }