 # todo_list
 ---
 
 ### Front-end CRUD web-app made with JavaScript

 [check out the site](https://kiizerd.github.io/todo_list/dist/)

 ---

  Data from users is stored using the browsers LocalStorage API.  
  All of the storage operations are handled by a [Database module](https://github.com/kiizerd/todo_list/blob/main/src/database.js) 

 ---

  The styling and UI is made with [Fomantic UI](https://fomantic-ui.com/), a community fork of [Semantic UI](https://semantic-ui.com/), which I choose due to issues with installing Semantic on Windows and temporarily only having access to a Windows device.

  My experience with Fomantic/Semantic was amazing and I would heavily recommend it to anyone. 
  There are many features that I learned of a little late that I plan to use in my future projects, such as quick theming and Global site variables.

 ---

  I experimented with an [EventAggregator Module](https://github.com/kiizerd/todo_list/blob/main/src/events.js) with a Pub/Sub modal to handle most of the inter-module operations.  
  Some problems I had with my implementation were..  
  - Duplicating Event handlers:  
    - Problem: a certain handler for a certain event would get applied to that even more than once so  
        when the event fired multiple duplicate handlers would execute causing widespread pandemonium.       
    - My solution: Remove all event subscriptions from repeatable scope, ensuring only 1 of each  
      specific handler function         
  - Frequent Events set off untimely, namely 'requestProjects' & 'projectsReceipt' event pair:    
    - Problem: some events that were fired frequently were intercepted by unwanted handlers causing  
      data to be arriving at the wrong places.          
    - My solution: Implemented a simple Token class to set on the first Events publish to be checked  
      on the second Events subscription and if no match the event is ignored.    
  - Bad timing on event chains:        
    - Problem: on some events that propagated to a few different modules the execution of certain  
      functions was off by a fraction of a second causing incorrect displays or storage inconsistencies.          
    - My solution: I wanted to implement an AJAX solution but I decided on a few well placed setTimeout  
      functions for an easier and quicker patch that would be fine until I have a better grasp  
      of asynchronous JavaScript.  

    
