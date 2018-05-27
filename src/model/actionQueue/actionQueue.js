import ActionNode from './actionNode/actionNode';

export default class ActionQueue {
  constructor(nodes = {}, time = 0, serialCode = 0) {
    this.nodes = nodes;
    this.serialCode = serialCode;
    this.time = time;
    this.addActions = this.addActions.bind(this);
    this.processNode = this.processNode.bind(this);
    this.copy = this.copy.bind(this);
    this.updateserialCode = this.updateserialCode.bind(this);
    this.equals = this.equals.bind(this);
  }
  addActions(actions) {
    let serialCodemand = 0;
    actions.forEach(action => {
      if (!this.nodes[action.time]) {
        this.nodes[action.time] = new ActionNode();
      }
      serialCodemand = action.serialCode * ((this.time + action.time) % 1000);
      this.nodes[action.time].addAction(action.action, -1 * action.serialCode);
      this.updateserialCode(serialCodemand);
    }, this);
  }
  processNode(state, shift = true) {
    if (this.nodes[this.time]) {
      this.nodes[this.time].runActions(state, serialCodemand => this.updateserialCode(serialCodemand));
    }
    if (shift) {
      // this.nodes.shift();
      this.time += 1;
    }
  }
  copy = actions => {
    const clone = new ActionQueue(this.nodes.map(node => node.copy()), this.time);
    clone.addActions(actions);
    return clone;
  }
  updateserialCode = serialCodemand => {
    this.serialCode += serialCodemand;
    this.serialCode = this.serialCode % (Number.MAX_SAFE_INTEGER / 100000);
  }
  equals => actionQueue 
  
}
