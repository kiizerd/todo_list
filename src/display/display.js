import { getHeader } from './displayHeader';
import { getHomePage } from './displayHome';

const Display = (function() {
  const content = document.getElementById('content');

  function init() {
    setActivePage('home');
    content.setActivePage = setActivePage
  }

  function setActivePage(pageName) {
    let page = getPage(pageName);
    content.innerHTML = '';
    content.append(getHeader(), page());
    window.scrollTo(0, 0);
    
    console.log('going to -->> ' + pageName);
  }

  function getPage(name) {
    const pages = {
      'home': getHomePage,
      'history': getHistoryPage
    }

    return !pages[name] ? getProjectPage.bind(name) : pages[name];
  }

  function getProjectPage() {
    console.log('GET - project: ' + this);
  }

  function getTaskCard(task) {}

  function getHistoryPage() {
    console.log('GET - History Page - 404 - Page not made lol')
  }

  return { init }
})();

export { Display }