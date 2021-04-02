/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/display/display.js":
/*!********************************!*\
  !*** ./src/display/display.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Display\": () => (/* binding */ Display)\n/* harmony export */ });\n/* harmony import */ var _displayHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./displayHeader */ \"./src/display/displayHeader.js\");\n/* harmony import */ var _displayHomePage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./displayHomePage */ \"./src/display/displayHomePage.js\");\n\r\n\r\n\r\nconst Display = (function() {\r\n\r\n  function init() {\r\n    const header = (0,_displayHeader__WEBPACK_IMPORTED_MODULE_0__.getHeader)(),\r\n          homePage = (0,_displayHomePage__WEBPACK_IMPORTED_MODULE_1__.getHomePage)();\r\n\r\n    const content = document.getElementById('content');\r\n    content.setActivePage = pageName => {\r\n      let page = (pageName === 'home') ? homePage : getProjectPage(pageName);\r\n      content.innerHTML = '';\r\n      content.append(header, page);\r\n      window.scrollTo(0, 0);\r\n    }\r\n\r\n    content.setActivePage('home');\r\n  }\r\n\r\n  function getProjectPage(project) {}\r\n\r\n  function getTaskCard(task) {}\r\n\r\n  return { init }\r\n})();\r\n\r\n\n\n//# sourceURL=webpack://todo_list/./src/display/display.js?");

/***/ }),

/***/ "./src/display/displayHeader.js":
/*!**************************************!*\
  !*** ./src/display/displayHeader.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getHeader\": () => (/* binding */ getHeader)\n/* harmony export */ });\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ */ \"./src/index.js\");\n\r\n\r\nconst Display = (function() {\r\n\r\n  function getHeader() {\r\n    const header = document.createElement('div');\r\n    header.classList.add('row');\r\n    header.id = 'header';\r\n  \r\n    const nav = getNav();\r\n  \r\n    header.append(nav);\r\n  \r\n    return header;\r\n  };\r\n\r\n  function getNav() {\r\n    const nav = document.createElement('nav');\r\n    nav.classList.add('navbar', 'navbar-expand-lg', 'navbar-dark', 'bg-dark');\r\n\r\n    const navContainer = getNavContainer();\r\n  \r\n    nav.append(navContainer);\r\n    \r\n    let navOffset = nav.offsetTop;\r\n    window.onscroll = function() {\r\n      if (window.pageYOffset > navOffset) {\r\n        nav.classList.add('sticky');\r\n      } else {\r\n        nav.classList.remove('sticky');\r\n      }\r\n    }\r\n  \r\n    return nav\r\n  };\r\n  \r\n  function getNavContainer() {\r\n    const div = document.createElement('div');\r\n    div.classList.add('container-fluid');\r\n\r\n    const navBrand = getNavBrand();\r\n    const navToggler = getNavToggler();\r\n    const navCollapse = getNavCollapse();\r\n\r\n    div.append(navBrand, navToggler, navCollapse);\r\n\r\n    return div\r\n  };\r\n\r\n  function getNavBrand() {\r\n    const brand = document.createElement('a');\r\n    brand.classList.add('navbar-brand');\r\n    brand.textContent = 'Todo-List';\r\n    brand.href = '#';\r\n\r\n    return brand;\r\n  };\r\n\r\n  function getNavToggler() {\r\n    const toggler = document.createElement('button');\r\n    toggler.classList.add('navbar-toggler');\r\n    toggler.type = 'button';\r\n    toggler.setAttribute('data-bs-toggle', 'collapse');\r\n    toggler.setAttribute('data-bs-target', '#nav-collapse');\r\n    toggler.setAttribute('aria-controls', 'nav-collapse');\r\n    toggler.setAttribute('aria-expanded', 'false');\r\n    toggler.setAttribute('aria-label', 'Toggle navigation');\r\n\r\n    const span = document.createElement('span');\r\n    span.classList.add('navbar-toggler-icon');\r\n\r\n    toggler.append(span);\r\n\r\n    return toggler;\r\n  };\r\n\r\n  function getNavCollapse() {\r\n    const div = document.createElement('div');\r\n    div.classList.add('collapse', 'navbar-collapse');\r\n    div.id = 'nav-collapse';\r\n\r\n    const navList = getNavList();\r\n    \r\n    div.append(navList);\r\n\r\n    return div;\r\n  };\r\n\r\n  function getNavList() {\r\n    const list = document.createElement('ul');\r\n    list.classList.add('navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0');\r\n\r\n    const homeListItem = getNavItem('home');\r\n    const projectListItem = getNavItem('project');\r\n    const historyListItem = getNavItem('history');\r\n\r\n    list.append(homeListItem, projectListItem, historyListItem);\r\n\r\n    return list;\r\n  };\r\n\r\n  function getNavItem(item) {\r\n    const listItem = document.createElement('li');\r\n    listItem.classList.add('nav-item');\r\n\r\n    const itemLink = getNavItemLink(item);\r\n    \r\n    listItem.append(itemLink);\r\n\r\n    if (item === 'project') {\r\n      listItem.classList.add('dropdown');\r\n      listItem.append(getDropdownMenu())\r\n    }\r\n  \r\n    return listItem;\r\n  };\r\n\r\n  function getNavItemLink(item) {\r\n    const link = document.createElement('a');\r\n    link.classList.add('nav-link');\r\n    link.href = '#';\r\n    link.textContent = (item === 'home') ? 'Home' :\r\n                       (item === 'history') ? 'History' : '';\r\n    link.tag = item\r\n    link.setAttribute('aria-current', item);\r\n    link.addEventListener('click', e => {navItemClick(e)})\r\n\r\n    if (item === 'project') {\r\n      link.classList.add('dropdown-toggle');\r\n      link.role = 'button';\r\n      link.id = 'navbarDropdown';\r\n      link.setAttribute('data-bs-toggle', 'dropdown');\r\n      link.setAttribute('aria-expanded', 'false');\r\n      link.textContent = 'Projects';\r\n    }\r\n    \r\n    function navItemClick(event) {\r\n      const content = document.getElementById('content');\r\n      content.setActivePage(event.target.tag);\r\n    };\r\n    \r\n    return link\r\n  };\r\n\r\n  function getDropdownMenu() {\r\n    const list = document.createElement('ul');\r\n    list.classList.add('dropdown-menu');\r\n    list.setAttribute('aria-labelledby', 'navbarDropdown');\r\n\r\n    let listItems = ['General', 'Home', 'Work'];\r\n\r\n    for (let i in listItems) {\r\n      let item = getDropdownListItems(listItems[i]);\r\n      list.append(item);\r\n    }\r\n\r\n    function getDropdownListItems(projectName) {\r\n      const item = document.createElement('li');\r\n      const itemLink = document.createElement('a');\r\n\r\n      itemLink.classList.add('dropdown-item');\r\n      itemLink.textContent = projectName;\r\n      itemLink.href = '#';\r\n\r\n      item.append(itemLink);\r\n\r\n      return item\r\n    }\r\n    \r\n    return list\r\n  }\r\n\r\n\r\n  return { getHeader }\r\n\r\n})();\r\n\r\nconst getHeader = Display.getHeader;\r\n\r\n\n\n//# sourceURL=webpack://todo_list/./src/display/displayHeader.js?");

/***/ }),

/***/ "./src/display/displayHomePage.js":
/*!****************************************!*\
  !*** ./src/display/displayHomePage.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getHomePage\": () => (/* binding */ getHomePage)\n/* harmony export */ });\nconst Display = (function() {\r\n\r\n  function getHomePage() {\r\n    \r\n  }\r\n  \r\n  return { getHomePage }\r\n})()\r\n\r\nconst getHomePage = Display.getHomePage;\r\n\r\n\n\n//# sourceURL=webpack://todo_list/./src/display/displayHomePage.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _display_display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./display/display */ \"./src/display/display.js\");\n\r\n\r\n_display_display__WEBPACK_IMPORTED_MODULE_0__.Display.init();\r\n\n\n//# sourceURL=webpack://todo_list/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;