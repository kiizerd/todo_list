import { EventAggregator } from '../events';
import { Generator } from '../generator'

const Display = (function() {

  EventAggregator.subscribe('newProjectClicked', () => {
    let modal = document.getElementById('newProjectModal');
    if (modal) {}
    else {
      modal = getNewProjectModal();
    }

    console.log(modal)

    modal.toggle();
  });

  function getNewProjectModal() {
    const modalObj = Generator.createModal();

    return modalObj
  }

  function getProjectPage(projectName) {
    
  }

  return { getProjectPage }
})()

const Project = Display

export { Project }