import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('newProjectModal');
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

    const initToggles = initFormToggles();
    for (const toggle of initToggles) {
      toggle();
    }
  });

  function getNewProjectModalObj() {
    const modal = Generator.createModal();
    modal.id = 'newProjectModal';

    modal.header.textContent = 'New Project';

    const modalForm = getNewProjectForm()

    modal.content.append(modalForm);

    return modal
  };

  function getNewProjectForm() {
    const form = Generator.createForm();

    return form
  };

  function getProjectPage(projectName) {
    
  };

  function initFormToggles() {
    function initDueDateToggle() {
      const fieldId = 'new-form-dueDateField';
      const toggleId = 'new-form-dueDateToggle';
      const dueDateToggle = document.getElementById(toggleId);
      dueDateToggle.classList.remove('hidden');
      console.log('made it here 3', dueDateToggle)
      dueDateToggle.onclick = () => {
        console.log(dueDateToggle, 'clicked');
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
      console.log('made it here 3.5', dateStartedToggle)
      dateStartedToggle.onclick = () => {
        console.log(dateStartedToggle, 'clicked');
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