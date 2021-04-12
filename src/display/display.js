import { EventAggregator } from '../events';
import { addProjectEvent } from './displayHeader';
import { getHomePage } from './displayHome';
import { Project } from './displayProject';

const Display = (function() {
  // Project; // temp module call to make sure displayProject is run
  
  const content = document.getElementById('content');

  function init() {
    addProjectEvent()
    setActivePage('home');
    content.setActivePage = setActivePage
  }

  function setActivePage(pageName) {
    let page = getPage(pageName);
    content.innerHTML = '';
    content.append(page());
    content.activePage = page;
    
    window.scrollTo(0, 0);
  }

  function getPage(name) {
    const pages = {
      'home': getHomePage,
      'history': getHistoryPage
    }

    return !pages[name] ? selectProjectPage(name) : pages[name];
  }

  function selectProjectPage(projectName) {
    function pageClosure() {
      return Project.getProjectPage(projectName)
    };
    return pageClosure 
  };

  function getTaskCard(task) {}

  function getHistoryPage() {}

  return { init }
})();

export { Display }