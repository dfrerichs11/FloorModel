import ActionNode from './actionNode/actionNode';

export default class ActionQueue {
  constructor(nodes = [], time = 0) {
    this.nodes = nodes;
    this.time = time;
    this.addActions = this.addActions.bind(this);
    this.processNode = this.processNode.bind(this);
    this.copy = this.copy.bind(this);
  }
  addActions(actions) {
    actions.forEach(action => {
      if (!this.nodes[action.time]) {
        this.nodes[action.time] = new ActionNode();
      }
      this.nodes[action.time].addAction(action.action);
    }, this);
  }
  processNode(state, shift = true) {
    if (this.nodes[0]) {
      this.nodes[0].runActions(state);
    }
    if (shift) {
      this.nodes.shift();
      this.time += 1;
    }
  }
  copy = actions => {
    const clone = new ActionQueue(this.nodes.map(node => node.copy()), this.time);
    clone.addActions(actions);
    return clone;
  }
}
