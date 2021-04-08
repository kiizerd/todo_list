// import { Collapse, Dropdown } from 'bootstrap';
import { boostrap } from 'bootstrap';

const Display = (function() {
  const content = document.getElementById('content');

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
    div.id = 'nav-container';

    const navBrand = getNavBrand();

    function getNavBrand() {
      const brand = document.createElement('a');
      brand.classList.add('navbar-brand');
      brand.textContent = 'Todo-List';
      brand.href = '#';
    
      return brand;
    };

    const navToggler = getNavToggler();

    const navCollapse = getNavCollapse();

    div.append(navBrand, navToggler, navCollapse);

    return div
  };
  
  function getNavToggler() {
    const toggler = document.createElement('button');
    toggler.classList.add('navbar-toggler');
    toggler.setAttribute('data-bs-toggle', 'collapse');
    toggler.setAttribute('data-bs-target', '#nav-collapse');
    toggler.setAttribute('aria-controls', 'nav-collapse');
    toggler.setAttribute('aria-expanded', 'false');
    toggler.setAttribute('aria-label', 'Toggle navigation');
    toggler.type = 'button';

    const span = document.createElement('span');
    span.classList.add('navbar-toggler-icon');

    toggler.append(span);

    return toggler;
  };        

  function getNavCollapse() {
    const div = document.createElement('div');
    div.id = 'nav-collapse';
    div.classList.add('collapse', 'navbar-collapse');
    div.setAttribute('data-bs-toggle', 'collapse');
    div.setAttribute('data-bs-target', '#nav-collapse');

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
    
    function getNavItem(item) {
        const listItem = document.createElement('li');
        listItem.classList.add('nav-item');
    
        const itemLink = getNavItemLink(item);
        
        listItem.append(itemLink);
    
        if (item === 'project') {
          listItem.classList.add('dropdown');
          listItem.append(getDropdownMenu());
        }
        
        function getNavItemLink(item) {
            const link = document.createElement('a');
            link.setAttribute('aria-current', item);
            link.classList.add('nav-link');
            link.href = '#';
            link.tag = item;
        
            if (item === 'project') {
              link.classList.add('dropdown-toggle');
              const dropdownObj = new bootstrap.Dropdown(link);
              link.setAttribute('data-bs-toggle', 'dropdown');
              link.setAttribute('aria-expanded', 'false');
              link.textContent = 'Projects';
              link.id = 'navbarDropdown';
              link.role = 'button';
            } else {
              link.textContent = (item === 'home') ? 'Home' :
                                 (item === 'history') ? 'History' : '';
              link.addEventListener('click', e => {navItemClick(e)});
            }
            
            return link
        };
      
        return listItem;
    };

    list.append(homeListItem, projectListItem, historyListItem);

    return list;
  };

  function getDropdownMenu() {
    const list = document.createElement('ul');
    list.classList.add('dropdown-menu', 'dropdown-menu-dark', 'animate', 'slideIn');
    list.setAttribute('aria-labelledby', 'navbarDropdown');

    let listItems = ['General', 'Home', 'Work'];

    for (let i in listItems) {
      let item = getDropdownListItems(listItems[i]);
      list.append(item);
    }

    function getDropdownListItems(projectName) {
      const item = document.createElement('li');
      const itemLink = document.createElement('a');

      itemLink.tag = itemLink.textContent = projectName;
      itemLink.classList.add('dropdown-item');
      itemLink.href = '#';
      itemLink.addEventListener('click', e => {navItemClick(e)});

      item.append(itemLink);

      return item
    }
    
    return list
  }      
    
  function navItemClick(event) {
    content.setActivePage(event.target.tag);
  };

  return { getHeader }

})();

const getHeader = Display.getHeader;

export { getHeader };