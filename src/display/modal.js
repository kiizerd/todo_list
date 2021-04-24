import { EventAggregator, Token } from '../events/events';
import Generator from '../generator';

const Modal = ((function iife() {
  function getFormData(context, object) {
    const form = document.forms[`${context}-${object}-form`];

    const formData = {
      title: form.elements[0].value,
      priority: Number(form.elements[1].value),
      description: form.elements[2].value,
      dates: {
        started: form.elements[3].value,
        due: form.elements[5].value,
      },
    };

    if (context === 'new') form.reset(context, object);

    return formData;
  }

  function showModal(context, object) {
    const modalId = `${context}-${object}-modal`;
    const formId = `${context}-${object}-form`;

    const form = document.forms[formId];

    function showToast() {
      const objectCapital = object.charAt(0).toUpperCase() + object.slice(1);
      const toastColor = object === 'task' ? 'olive' : 'green';

      $('body')
        .toast({
          position: 'top center',
          showProgress: 'bottom',
          displayTime: 1600,
          message: `${objectCapital} created..`,
          class: `${toastColor} inverted`,
        });
    }

    $(`#${modalId}`)
      .modal({
        onApprove: () => {
          let result = false;

          $(form).form('validate form');
          if (form.valid) {
            const formData = getFormData(context, object);
            if (context === 'new') {
              const eventName = object === 'task' ? 'createTask' : 'createProject';

              EventAggregator.publish(eventName, formData);

              showToast(context, object);
            } else if (context === 'edit') {
              form.activeObject.setProperties(formData);
            }

            result = form.valid;
          }

          return result;
        },
        onDeny: () => {
          setTimeout(() => {
            if (context === 'new') { form.reset(); }
            if (context === 'edit') { form.fill(form.activeObject); }
          }, 100);
        },
      })
      .modal('show');

    $(`#${modalId} #new-form-priority-dropdown`)
      .dropdown();

    $('.ui.checkbox')
      .checkbox();

    $('.ui.calendar').calendar({
      type: 'date',
    });

    function initFormToggles() {
      function initDueDateToggle() {
        const fieldId = '#new-form-dueDateField';
        const toggleId = '#new-form-dueDateToggle';
        const dueDateToggle = document.querySelector(`#${modalId} ${toggleId}`);
        dueDateToggle.classList.remove('hidden');
        dueDateToggle.onclick = () => {
          const dueDateField = document.querySelector(`#${modalId} ${fieldId}`);
          if (dueDateToggle.checked) {
            dueDateField.classList.remove('disabled');
          } else {
            dueDateField.classList.add('disabled');
          }
        };
      }

      function initDateStartedToggle() {
        const fieldId = '#new-form-dateStartedField';
        const toggleId = '#new-form-dateStartedToggle';
        const dateStartedToggle = document.querySelector(`#${modalId} ${toggleId}`);
        dateStartedToggle.classList.remove('hidden');
        dateStartedToggle.onclick = () => {
          const dateStartedField = document.querySelector(`#${modalId} ${fieldId}`);
          if (dateStartedToggle.checked) {
            dateStartedField.classList.add('disabled');
          } else {
            dateStartedField.classList.remove('disabled');
          }
        };
      }

      return [initDueDateToggle, initDateStartedToggle];
    }

    const initToggles = initFormToggles();
    initToggles.forEach((toggle) => toggle());
  }

  const reqToken = new Token('requestProjects', 'displayModal');

  let requestedProject;
  EventAggregator.subscribe('projectsReceipt', (projectList) => {
    if (projectList.token && projectList.token === reqToken) {
      [requestedProject] = projectList;
    }
  });

  function getProject(projectName) {
    const reqObject = {
      filter: {
        byName: projectName,
      },
      token: reqToken,
    };

    EventAggregator.publish('requestProjects', reqObject);

    return requestedProject;
  }

  function resetForm(context, object) {
    const formModal = this.parentElement;
    formModal.textContent = '';

    // eslint-disable-next-line no-use-before-define
    const newForm = getForm(context, object);

    formModal.append(newForm);

    $(`#${context}-${object}-modal #new-form-priority-dropdown`)
      .dropdown();
  }

  function fillForm(object) {
    this.elements[0].value = object.title;
    this.elements[1].value = object.priority;
    this.elements[2].value = object.description;
    this.elements[3].value = object.dates.started;
    this.elements[5].value = object.dates.due;
  }

  function getForm(context, object) {
    const form = Generator.createForm();
    form.id = `${context}-${object}-form`;
    form.onsubmit = 'return false';
    form.reset = resetForm.bind(form);
    form.fill = fillForm.bind(form);

    return form;
  }

  function getModal(context, object) {
    const modal = Generator.createModal();
    modal.id = `${context}-${object}-modal`;
    modal.classList.add(object === 'task' ? 'tiny' : 'small');

    modal.header.textContent = (context === 'new' ? 'New ' : 'Edit ')
                             + (object === 'task' ? 'Task' : 'Project');

    const modalForm = getForm(context, object);

    modal.content.append(modalForm);

    modal.form = modalForm;

    modalForm.addResetBtn.bind(modalForm).call();

    return modal;
  }
  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('new-project-modal');
    if (!modal) {
      modal = getModal('new', 'project');
      document.body.append(modal);
    }

    showModal('new', 'project');
  });

  EventAggregator.subscribe('newTaskClicked', () => {
    let modal = document.getElementById('new-task-modal');
    if (!modal) {
      modal = getModal('new', 'task');
      document.body.append(modal);
    }

    showModal('new', 'task');
  });

  EventAggregator.subscribe('editProjectClicked', (projectName) => {
    let modal = document.getElementById('edit-project-modal');
    if (!modal) {
      modal = getModal('edit', 'project');
      document.body.append(modal);
    }

    const project = getProject(projectName);

    modal.activeObject = project;
    modal.form.activeObject = project;
    modal.form.fill(project);

    showModal('edit', 'project');
  });

  EventAggregator.subscribe('editTaskClicked', (args) => {
    let modal = document.getElementById('edit-task-modal');
    if (!modal) {
      modal = getModal('edit', 'task');
      document.body.append(modal);
    }

    const taskName = args[0];
    const projectName = args[1];

    const project = getProject(projectName);
    const task = project.getTask(taskName);

    modal.activeObject = task;
    modal.form.activeObject = task;
    modal.form.fill(task);

    showModal('edit', 'task');
  });
})());

export default Modal;
