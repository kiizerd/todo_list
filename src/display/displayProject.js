import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('newProjectModal');
    if (!modal) modal = getNewProjectModalObj()._element;

    console.log(modal);

    modal.bootstrapObject.toggle();
  });

  function getNewProjectModalObj() {
    const modalObj = Generator.createModal();
    const modal = modalObj._element;
    modal.id = 'newProjectModal';
    modal.bootstrapObject = modalObj;

    const modalTitle = document.querySelector('#newProjectModal .modal-title');

    console.log(modalTitle);

    console.log(modal.header);

    return modalObj
  };

  function getNewProjectForm() {
    const form = Generator.createForm();

    return form
  };

  function getProjectPage(projectName) {
    
  };

  return { getProjectPage }
})()

const Project = Display

export { Project }