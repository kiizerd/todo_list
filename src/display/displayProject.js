import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('new-project-modal');
    if (!modal) {
      modal = getNewProjectModalObj();
      document.body.append(modal);
    }

    $('.ui.modal')
      .modal('show')
    ;

    $('#new-form-priority-dropdown')
      .dropdown()
    ;

    $('.ui.checkbox')
      .checkbox()
    ;

    $('.ui.calendar').calendar({
      type: 'date'
    });

    addConfirmClickEvent();

    const initToggles = initFormToggles();
    for (const toggle of initToggles) {
      toggle();
    }
  });

  function getNewProjectModalObj() {
    const modal = Generator.createModal();
    modal.id = 'new-project-modal';

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

  function addConfirmClickEvent() {
    const confirmBtn = document.querySelector('#new-project-modal .actions .positive');
    confirmBtn.onclick = () => { 
      const formData = getNewProjectFormData();
      EventAggregator.publish('createProject', formData);
    }
  }

  function getNewProjectFormData() {
    const form = document.forms['new-project-form'];

    return {
      title: form.elements[0].value,
      priority: form.elements[1].value,
      description: form.elements[2].value,
      dates: {
        started: form.elements[4],
        due: form.elements[5]
      }
    };

  }

  function getProjectPage(projectName) {
    
  };

  function initFormToggles() {
    function initDueDateToggle() {
      const fieldId = 'new-form-dueDateField';
      const toggleId = 'new-form-dueDateToggle';
      const dueDateToggle = document.getElementById(toggleId);
      dueDateToggle.classList.remove('hidden');
      dueDateToggle.onclick = () => {
        const dueDateField = document.getElementById(fieldId);
        if (dueDateToggle.checked) {
          dueDateField.classList.remove('disabled');
        } else {
          dueDateField.classList.add('disabled');
        };
      };
    };

    function initDateStartedToggle() {
      const fieldId = 'new-form-dateStartedField';
      const toggleId = 'new-form-dateStartedToggle';
      const dateStartedToggle = document.getElementById(toggleId);
      dateStartedToggle.classList.remove('hidden');
      dateStartedToggle.onclick = () => {
        const dateStartedField = document.getElementById(fieldId);
        if (dateStartedToggle.checked) {
          dateStartedField.classList.add('disabled');
        } else {
          dateStartedField.classList.remove('disabled');
        };
      };
    };

    return [initDueDateToggle, initDateStartedToggle]
  };

  return { getProjectPage }
})()

const Project = Display

export { Project }