import { EventAggregator } from '../events';

const Display = (function() {
  
  EventAggregator.subscribe('projectCreated', project => {
    addProjectToMenu(project);
  });

  function addProjectToMenu(project) {
    const projectsMenu = document.getElementById('header-projects-menu');

    const newProjectItem = getProjectMenuItem();

    function getProjectMenuItem() {
      const item = document.createElement('a');
      item.classList.add('item');
      item.href = '#'
      item.tag = item.textContent = project.title;

      
      return item
    }
    
    projectsMenu.append(newProjectItem);
    
    addClickEvents();
  }

  function addClickEvents() {
    const headerLinks = Array.from(document.querySelectorAll('#header a'));

    for (const link of headerLinks) {
      link.tag = link.textContent.toLowerCase();
      console.log(link.tag);
      link.onclick = e => { linkClickEvent(e) };
    }
  }

  function linkClickEvent(e) {
    const content = document.getElementById('content');
    content.setActivePage(e.target.tag);    
  }

  function addProjectEvent() {
    const btn = document.getElementById('header-new-project-btn');
    btn.onclick = () => EventAggregator.publish('newProjectClicked', btn);
  }

  return { addProjectEvent }
})();

const addProjectEvent = Display.addProjectEvent;

export { addProjectEvent };