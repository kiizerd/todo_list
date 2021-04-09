import { EventAggregator } from '../events';
import { addClickEvents } from './displayHeader';
import { getHomePage } from './displayHome';
import { Project } from './displayProject';

const Display = (function() {
  Project; // temp module call to make sure displayProject is run
  const content = document.getElementById('content');

  function init() {
    addClickEvents();
    setActivePage('home');
    content.setActivePage = setActivePage
  }

  function setActivePage(pageName) {
    let page = getPage(pageName);
    content.innerHTML = '';
    content.append(page());
    window.scrollTo(0, 0);

    console.log('going to page -->>', pageName);
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
    return (projectName) => { console.log('Project clicked:', projectName) };
  }

  function getTaskCard(task) {}

  function getHistoryPage() {}

  return { init }
})();

export { Display }