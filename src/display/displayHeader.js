import { EventAggregator, Token } from '../events';

const Display = (function() {

  
  EventAggregator.subscribe('projectCreated', project => {
    updateMenu();
  });

  
  EventAggregator.subscribe('projectFromStorage', project => {
    updateMenu();
  });


  EventAggregator.subscribe('storageUpdated', () => {
    updateMenu();
  });


  EventAggregator.subscribe('activePageSet', pageName => {
    const headerLinks = Array.from(document.querySelectorAll('#header a'));

    const oldActiveItem = document.querySelector('#header .active');
    if (oldActiveItem) {
      oldActiveItem.classList.remove('active');
    };

    for(const item of Array.from(headerLinks)) {
      if (item.tag === pageName) {
        item.classList.add('active');
      };
    };
  });


  function updateMenu() {
    const reqToken = new Token('requestProjects', 'displayHeader');

    const reqObject = {
      sort: {
        byName: 'desc'
      },
      _token: reqToken
    };
    
    let projects;    
    EventAggregator.subscribe('projectsReceipt', reqProjects => {
      if (reqProjects._token && !(reqProjects._token === reqToken)) return false
      projects = reqProjects        
    });
    
    EventAggregator.publish('requestProjects', reqObject);
    
    const projectsMenu = document.getElementById('header-projects-menu');
    projectsMenu.textContent = '';
    
    for (const project of projects) {
      addProjectToMenu(project.title);
    };
  }; 

  function addProjectToMenu(projectName) {
    const projectsMenu = document.getElementById('header-projects-menu');

    const newProjectItem = getProjectMenuItem();

    function getProjectMenuItem() {
      const item = document.createElement('a');
      item.classList.add('item');
      item.href = '#'
      item.tag = item.textContent = projectName;
      
      return item
    }
    
    projectsMenu.append(newProjectItem);
    
    addClickEvents();
  }

  function addClickEvents() {
    const headerLinks = Array.from(document.querySelectorAll('#header a'));

    for (const link of headerLinks) {
      const text = link.textContent
      if (text === 'Home' || text === 'History' || text === 'User') {
        link.tag = link.textContent.toLowerCase();
      } else {
        link.tag = link.textContent;
      }
      link.onclick = e => { linkClickEvent(e) };
    }
  }

  function linkClickEvent(e) {
    const content = document.getElementById('content');
    content.setActivePage(e.target.tag);    
  }

  function addNewProjectEvent() {
    const btn = document.getElementById('header-new-project-btn');
    btn.onclick = () => EventAggregator.publish('newProjectClicked', btn);
  }

  return { addNewProjectEvent }
})();

const addNewProjectEvent = Display.addNewProjectEvent;

export { addNewProjectEvent };