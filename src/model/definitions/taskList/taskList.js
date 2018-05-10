import Task from './task/task';

export default class TaskList {
  constructor(tasks) {
    this.tasks = tasks.map(operations => new Task(operations));

    this.getAvailableTasks = this.getAvailableTasks.bind(this);
  }

  getAvailableTasks = state => {
    let paths = [];
    this.tasks.forEach(task => { paths = paths.concat(task.availablePaths(state)); });
    return paths;
  }
}
