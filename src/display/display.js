import { EventAggregator } from '../events';
// import { getHeader } from './displayHeader';
import { getHomePage } from './displayHome';
import { Project } from './displayProject';

const Display = (function() {
  Project;
  const content = document.getElementById('content');

  function init() {
    setActivePage('home');
    content.setActivePage = setActivePage
  }

  function setActivePage(pageName) {
    let page = getPage(pageName);
    content.innerHTML = '';
    content.append(page());
    window.scrollTo(0, 0);
    
    console.log('going to -->> ' + pageName);
  }

  function getPage(name) {
    const pages = {
      'home': getHomePage,
      'history': getHistoryPage
    }

    return !pages[name] ? selectProjectPage(name) : pages[name];
  }

  function selectProjectPage(projectName) {
    // Project.getProjectPageAsClosure(projectName);
    return (projectName) => {console.log(projectName)}
  }

  function getTaskCard(task) {}

  function getHistoryPage() {
    console.log('GET - History Page - 404 - Page not made lol')
  }

  function showNewProjectModal() {
    console.log('fuckpo')
  }

  return { init }
})();

export { Display }