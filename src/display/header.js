import { EventAggregator, Token } from '../events/events';

const Header = ((function iife() {
  function addProjectToMenu(projectName) {
    const projectsMenu = document.getElementById('header-projects-menu');

    function getProjectMenuItem() {
      const item = document.createElement('a');
      item.classList.add('item');
      item.href = '#';
      item.tag = projectName;
      item.textContent = projectName;

      return item;
    }

    const newProjectItem = getProjectMenuItem();

    projectsMenu.append(newProjectItem);
  }

  function linkClickEvent(e) {
    const content = document.getElementById('content');
    content.setActivePage(e.target.tag);
  }

  function addClickEvents() {
    const headerLinks = Array.from(document.querySelectorAll('#header a'));

    headerLinks.forEach((linkElem) => {
      const link = linkElem;
      const text = link.textContent;
      if (text === 'Home' || text === 'History' || text === 'User') {
        link.tag = link.textContent.toLowerCase();
      } else {
        link.tag = link.textContent;
      }
      link.onclick = (e) => { linkClickEvent(e); };
    });
  }

  function updateMenu() {
    const reqToken = new Token('requestProjects', 'displayHeader');

    const reqObject = {
      sort: {
        byName: 'desc',
      },
      token: reqToken,
    };

    let projects;
    EventAggregator.subscribe('projectsReceipt', (reqProjects) => {
      if (reqProjects.token && !(reqProjects.token === reqToken)) return false;
      projects = reqProjects;

      return null;
    });

    EventAggregator.publish('requestProjects', reqObject);

    const projectsMenu = document.getElementById('header-projects-menu');
    projectsMenu.textContent = '';

    projects.forEach((project) => {
      addProjectToMenu(project.title);
    });

    addClickEvents();
  }
  EventAggregator.subscribe('projectCreated', () => {
    updateMenu();
  });

  EventAggregator.subscribe('projectFromStorage', () => {
    updateMenu();
  });

  EventAggregator.subscribe('storageUpdated', () => {
    updateMenu();
  });

  EventAggregator.subscribe('activePageSet', (pageName) => {
    const headerLinks = Array.from(document.querySelectorAll('#header a'));

    const oldActiveItem = document.querySelector('#header .active');
    if (oldActiveItem) {
      oldActiveItem.classList.remove('active');
    }

    Array.from(headerLinks).forEach((item) => {
      if (item.tag === pageName) {
        item.classList.add('active');
      }
    });
  });

  function addNewProjectEvent() {
    const btn = document.getElementById('header-new-project-btn');
    btn.onclick = () => EventAggregator.publish('newProjectClicked', btn);
  }

  addNewProjectEvent();

  return { };
})());

export default Header;
