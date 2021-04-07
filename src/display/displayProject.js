import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('newProjectModal');
    if (!modal) modal = getNewProjectModalObj()._element;
    modal.bootstrapObject.toggle();
  });

  function getNewProjectModalObj() {
    const modalObj = Generator.createModal();
    const modal = modalObj._element;
    modal.id = 'newProjectModal';

    modal.bootstrapObject = modalObj;
    
    console.log(modal);

    return modalObj
  }

  function getProjectPage(projectName) {
    
  }

  return { getProjectPage }
})()

const Project = Display

export { Project }