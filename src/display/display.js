import { EventAggregator } from '../events/events';
import getHomePage from './displayHome';
import getHistoryPage from './displayHistory';
import Project from './project';
import Header from './header';
import Modal from './modal';

const Display = ((function iife() {
  const content = document.getElementById('content');

  function selectProjectPage(projectName) {
    function pageClosure() {
      return Project.getProjectPage(projectName);
    }

    return pageClosure;
  }

  function getPage(name) {
    const pages = {
      home: getHomePage,
      history: getHistoryPage,
    };

    return !pages[name] ? selectProjectPage(name) : pages[name];
  }

  function setActivePage(pageName) {
    const page = getPage(pageName);
    page.pageName = pageName;

    content.innerHTML = '';
    content.append(page());
    content.activePage = pageName;

    window.scrollTo(0, 0);

    EventAggregator.publish('activePageSet', pageName);
  }

  function init() {
    const modal = Modal;
    const header = Header;
    setActivePage('home');
    content.setActivePage = setActivePage;

    return { modal, header };
  }

  EventAggregator.subscribe('updateDisplay', () => {
    setActivePage(content.activePage);
  });

  return { init };
})());

export default Display;
