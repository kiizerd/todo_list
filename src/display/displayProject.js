import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('new-project-modal');
    if (!modal) {
      modal = getNewProjectModal();
      document.body.append(modal);
    }

    initModal('project');
  });

  EventAggregator.subscribe('newTaskClicked', () => {
    let modal = document.getElementById('new-task-modal');
    if (!modal) {
      modal = getNewTaskModal()
      document.body.append(modal);
    }
    
    initModal('task');
  });

  function getNewTaskModal() {
    const modal = Generator.createModal();
    modal.id = 'new-task-modal';
    modal.classList.add('tiny');

    modal.header.textContent = 'New Task';

    const modalForm = getNewTaskForm();

    modal.content.append(modalForm);

    return modal
  }

  function getNewTaskForm() {
    const form = Generator.createForm();
    form.id = 'new-task-form';
    form.onsubmit = "return false";

    return form
  }

  function getNewProjectModal() {
    const modal = Generator.createModal();
    modal.id = 'new-project-modal';
    modal.classList.add('small');

    modal.header.textContent = 'New Project';

    const modalForm = getNewProjectForm();

    modal.content.append(modalForm);

    return modal
  };

  function getNewProjectForm() {
    const form = Generator.createForm();
    form.id = 'new-project-form';
    form.onsubmit = "return false";

    return form
  };

  function getNewFormData(formName) {
    const formId = 'new-' + `${formName}` + '-form'
    const form = document.forms[formId];

    return {
      title: form.elements[0].value,
      priority: form.elements[1].value,
      description: form.elements[2].value,
      dates: {
        started: form.elements[3].value,
        due: form.elements[5].value
      }
    };

  }

  function getProjectPage(projectName) {
    
  };

  function initModal(modal) {
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