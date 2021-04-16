import { EventAggregator } from '../events';
import { addProjectEvent } from './displayHeader';
import { getHomePage } from './displayHome';
import { Project } from './displayProject';

const Display = (function() {
  
  const content = document.getElementById('content');

  function init() {
    addProjectEvent()
    setActivePage('home');
    content.setActivePage = setActivePage
  };

  function setActivePage(pageName) {
    let page = getPage(pageName);
    page.pageName = pageName;

    content.innerHTML = '';
    content.append(page());
    content.activePage = pageName;
    
    window.scrollTo(0, 0);

    EventAggregator.publish('activePageSet', pageName);
  };

  function getPage(name) {
    const pages = {
      'home': getHomePage,
      'history': getHistoryPage
    }

    return !pages[name] ? selectProjectPage(name) : pages[name];
  };

  function selectProjectPage(projectName) {
    function pageClosure() {
      return Project.getProjectPage(projectName)
    };
    return pageClosure 
  };

  
  EventAggregator.subscribe('updateDisplay', () => {
    setActivePage(content.activePage);
  });

  function getHistoryPage() {}

  return { init }
})();

export { Display }