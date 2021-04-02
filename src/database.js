import { eventAggregator } from './events/events'
import { compareAsc } from 'date-fns'

const Database = (function() {
  const projects = {}
  
  function addProject(project) {
    projects[project.title] = project
  }
  
  eventAggregator.subscribe('projectCreated', projectObj => {
    addProject(projectObj);
  });
  
  eventAggregator.subscribe('requestProjects', options => {
    let sortedProjects = Object.values(projects).sort((p1, p2) => {
      if (p1.priority > p2.priority) return 1
      if (p1.priority < p2.priority) return -1
      if (p1.priority === p2.priority) {
        // sort by date due
      }
      eventAggregator.publish('projectsReceipt', sortedProjects);
    });
  });

  return {}
})()

export { Database }