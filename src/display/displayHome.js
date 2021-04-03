import { Generator } from '../generator';
import { EventAggregator } from '../events/events';
const Isotope = require('isotope-layout');

const Display = (function() {

  function getHomePage() {
    const div = getProjectsContainer();    
    const projectCards = getProjectCards()

    div.append(projectCards);

    return div;
  }

  function getProjectsContainer() {
    const div = document.createElement('div');
    div.classList.add('container-fluid');
    div.id = 'projects-container';

    let iso = new Isotope(div, {
      itemSelector: '.projects-item',
      layoutMode: 'fitRows'
    });

    return div
  }

  function getProjectCards(options) {
    const projectList = [];
    const cardList = [];
    
    EventAggregator.publish('requestProjects', options ? options : {
      sort: 'default',
      filter: 'default'
    });
    
    EventAggregator.subscribe('projectsReceipt', projects => {
      // reset local list to guarantee most up to date information
      projectList.length = 0;

      projects.forEach(project => projectList.push(project));
    });

    for (let i = 0; i < projectList.length; i++) {
      let card = createProjectCard(projectList[i]);
      cardList.push(card);
    };

    function createProjectCard(project) {
      const card = Generator.createCard()
      fillCard(card, project)
      card.classList.add('projects-item', 'bg-dark', 'text-white');

      return card
    }

    return cardList
  }

  function fillCard(card, project) {
    console.log(card, project)
  }
  
  return { getHomePage }
})()

const getHomePage = Display.getHomePage;

export { getHomePage }