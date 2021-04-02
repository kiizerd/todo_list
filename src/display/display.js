import { getHeader } from './displayHeader';
import { getHomePage } from './displayHomePage';

const Display = (function() {

  function init() {
    const header = getHeader(),
          homePage = getHomePage();

    const content = document.getElementById('content');
    content.setActivePage = pageName => {
      let page = (pageName === 'home') ? homePage : getProjectPage(pageName);
      content.innerHTML = '';
      content.append(header, page);
      window.scrollTo(0, 0);
    }

    content.setActivePage('home');
  }

  function getProjectPage(project) {}

  function getTaskCard(task) {}

  return { init }
})();

export { Display }