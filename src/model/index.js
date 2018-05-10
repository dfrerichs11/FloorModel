// Main class for the Floor Model
import ActionQueue from './actionQueue/actionQueue';
import State from './state/state';
import TaskList from './definitions/taskList/taskList';
import Entity from './state/entityList/entity/entity';
import EntityList from './state/entityList/entityList';

export default class FloorModel {
  constructor() {
    this.actionQueue = new ActionQueue();
    this.taskList = new TaskList([
      [
        {
          transitions: [
            { time: 0, state: 1, produce: [{ material: 1, qty: -1 }] },
            { time: 10, state: 0, produce: [{ material: 2, qty: 1 }] },
          ],
          groupIds: [1],
          initState: 0,
          BOM: [{ material: 1, qty: 1 }],
        },
      ],
      [
        {
          transitions: [
            { time: 0, state: 1, produce: [{ material: 2, qty: -1 }] },
            { time: 10, state: 0, produce: [{ material: 3, qty: 1 }] },
          ],
          groupIds: [2],
          initState: 0,
          BOM: [{ material: 2, qty: 1 }],
        },
      ],
      [
        {
          transitions: [
            { time: 0, state: -1, produce: [{ material: 2, qty: -1 }] },
          ],
          groupIds: [1],
          initState: -1,
          BOM: [{ material: 2, qty: 1 }],
        },
        {
          transitions: [
            { time: 2, state: -1, produce: [{ material: 2, qty: 1 }] },
          ],
          groupIds: [2],
          initState: -1,
          BOM: [],
        },
        {
          transitions: [
            { time: 0, state: 0, produce: [] },
            { time: 2, state: 2, produce: [] },
          ],
          groupIds: [3],
          initState: 1,
          BOM: [],
        },
      ],
      [
        {
          transitions: [
            { time: 0, state: 0, produce: [] },
            { time: 2, state: 1, produce: [] },
          ],
          groupIds: [3],
          initState: 2,
          BOM: [],
        },
      ],
    ]);
    this.state = new State(new EntityList([
      {
        state: 0,
        location: { x: 0, y: 0 },
        name: 'machine1',
        groupID: 1,
        inventory: { 1: 10 },
      },
      {
        state: 0,
        location: { x: 0, y: 0 },
        name: 'machine2',
        groupID: 2,
      },
      {
        state: 1,
        location: { x: 0, y: 0 },
        name: 'bob',
        groupID: 3,
      },
    ].map((ent, index) => new Entity(ent, index))));

    this.completionCheck = state => state.entityList.entities[1].inventory[3] > 2;
    this.runModel = this.runModel.bind(this);
    this.iterateModel = this.iterateModel.bind(this);
    this.branches = [{ state: this.state, queue: this.actionQueue, active: true }];
  }
  runModel() {
    let theseBranches = this.branches;
    let nextBranches = [];

    const expandBranch = branch => {
      if (branch.active) {
        this.iterateModel(branch.state, branch.queue).forEach(newBranch => {
          nextBranches.push(newBranch);
        });
      } else {
        nextBranches.push(branch);
      }
    };

    while (theseBranches.some(branch => branch.active)) {
      theseBranches.forEach(branch => expandBranch(branch));
      theseBranches = nextBranches;
      nextBranches = [];
    }
  }

  // this is a recursive function that accepts a state and an action queue
  // it will process the current action node without moving to the next node, then
  // it will check the given state against the globally defined task list
  // to get a list of available paths if no paths are available, it will process the current node
  // and move to the next one and recursively call
  // itself with the current state object (not a copy). If paths are available then
  // for each path it will recursively call itself with a copy of the given state
  // and a copy of the current action queue with the new actions added
  // tabling this approach because javascript doesn't love deep recursion
  // iterateModel(state, actionQueue) {
  //   if (this.completionCheck(state)) return;
  //   actionQueue.processNode(state, false);
  //   const tasks = this.taskList.getAvailableTasks(state);
  //   if (tasks.length === 0) {
  //     actionQueue.processNode(state, true);
  //     this.iterateModel(state, actionQueue);
  //   } else {
  //     tasks.forEach(task => {
  //       this.iterateModel(state.copy(), actionQueue.copy(task));
  //     });
  //   }
  // }

  iterateModel(state, queue) {
    const newBranches = [];
    if (this.completionCheck(state)) return { state, queue, active: false };
    queue.processNode(state, false);
    const tasks = this.taskList.getAvailableTasks(state);
    if (tasks.length === 0) {
      queue.processNode(state, true);
      newBranches.push({ state, queue, active: true });
    } else {
      tasks.forEach(task => {
        newBranches.push({ state: state.copy(), queue: queue.copy(task), active: true });
      });
    }
    return newBranches;
  }
}
