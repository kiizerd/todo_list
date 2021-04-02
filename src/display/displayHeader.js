import { projectInterface } from '../'

const Display = (function() {

  function getHeader() {
    const header = document.createElement('div');
    header.classList.add('row');
    header.id = 'header';
  
    const nav = getNav();
  
    header.append(nav);
  
    return header;
  };

  function getNav() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar', 'navbar-expand-lg', 'navbar-dark', 'bg-dark');

    const navContainer = getNavContainer();
  
    nav.append(navContainer);
    
    let navOffset = nav.offsetTop;
    window.onscroll = function() {
      if (window.pageYOffset > navOffset) {
        nav.classList.add('sticky');
      } else {
        nav.classList.remove('sticky');
      }
    }
  
    return nav
  };
  
  function getNavContainer() {
    const div = document.createElement('div');
    div.classList.add('container-fluid');

    const navBrand = getNavBrand();
    const navToggler = getNavToggler();
    const navCollapse = getNavCollapse();

    div.append(navBrand, navToggler, navCollapse);

    return div
  };

  function getNavBrand() {
    const brand = document.createElement('a');
    brand.classList.add('navbar-brand');
    brand.textContent = 'Todo-List';
    brand.href = '#';

    return brand;
  };

  function getNavToggler() {
    const toggler = document.createElement('button');
    toggler.classList.add('navbar-toggler');
    toggler.type = 'button';
    toggler.setAttribute('data-bs-toggle', 'collapse');
    toggler.setAttribute('data-bs-target', '#nav-collapse');
    toggler.setAttribute('aria-controls', 'nav-collapse');
    toggler.setAttribute('aria-expanded', 'false');
    toggler.setAttribute('aria-label', 'Toggle navigation');

    const span = document.createElement('span');
    span.classList.add('navbar-toggler-icon');

    toggler.append(span);

    return toggler;
  };

  function getNavCollapse() {
    const div = document.createElement('div');
    div.classList.add('collapse', 'navbar-collapse');
    div.id = 'nav-collapse';

    const navList = getNavList();
    
    div.append(navList);

    return div;
  };

  function getNavList() {
    const list = document.createElement('ul');
    list.classList.add('navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0');

    const homeListItem = getNavItem('home');
    const projectListItem = getNavItem('project');
    const historyListItem = getNavItem('history');

    list.append(homeListItem, projectListItem, historyListItem);

    return list;
  };

  function getNavItem(item) {
    const listItem = document.createElement('li');
    listItem.classList.add('nav-item');

    const itemLink = getNavItemLink(item);
    
    listItem.append(itemLink);

    if (item === 'project') {
      listItem.classList.add('dropdown');
      listItem.append(getDropdownMenu())
    }
  
    return listItem;
  };

  function getNavItemLink(item) {
    const link = document.createElement('a');
    link.classList.add('nav-link');
    link.href = '#';
    link.textContent = (item === 'home') ? 'Home' :
                       (item === 'history') ? 'History' : '';
    link.tag = item
    link.setAttribute('aria-current', item);
    link.addEventListener('click', e => {navItemClick(e)})

    if (item === 'project') {
      link.classList.add('dropdown-toggle');
      link.role = 'button';
      link.id = 'navbarDropdown';
      link.setAttribute('data-bs-toggle', 'dropdown');
      link.setAttribute('aria-expanded', 'false');
      link.textContent = 'Projects';
    }
    
    function navItemClick(event) {
      const content = document.getElementById('content');
      content.setActivePage(event.target.tag);
    };
    
    return link
  };

  function getDropdownMenu() {
    const list = document.createElement('ul');
    list.classList.add('dropdown-menu');
    list.setAttribute('aria-labelledby', 'navbarDropdown');

    let listItems = ['General', 'Home', 'Work'];

    for (let i in listItems) {
      let item = getDropdownListItems(listItems[i]);
      list.append(item);
    }

    function getDropdownListItems(projectName) {
      const item = document.createElement('li');
      const itemLink = document.createElement('a');

      itemLink.classList.add('dropdown-item');
      itemLink.textContent = projectName;
      itemLink.href = '#';

      item.append(itemLink);

      return item
    }
    
    return list
  }


  return { getHeader }

})();

const getHeader = Display.getHeader;

export { getHeader };