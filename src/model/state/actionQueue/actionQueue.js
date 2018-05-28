import ActionNode from './actionNode/actionNode';

export default class ActionQueue {
  constructor(state = {}, nodes = [], time = 0, serialCode = '') {
    this.nodes = nodes;
    this.state = state;
    this.serialCode = serialCode;
    this.time = time;
    this.addActions = this.addActions.bind(this);
    this.processNode = this.processNode.bind(this);
    this.copy = this.copy.bind(this);
    this.updateSerialCode = this.updateSerialCode.bind(this);
    this.attach = this.attach.bind(this);
  }
  attach = state => {
    this.state = state;
    return this;
  }
  addActions(actions) {
    actions.forEach(action => {
      if (!this.nodes[this.time + action.time]) {
        this.nodes[this.time + action.time] = new ActionNode();
      }
      this.nodes[this.time + action.time].addAction(action.action, action.serialCode);
    }, this);
    this.updateSerialCode();
  }
  processNode(shift = true) {
    if (this.nodes[this.time]) {
      this.nodes[this.time].runActions(this.state);
    }
    if (shift) {
      this.time += 1;
    }
    this.updateSerialCode();
  }
  copy = (actions = []) => {
    const clone = new ActionQueue(
      {},
      this.nodes.map(node => node.copy()),
      this.time,
      this.serialCode,
    );
    clone.addActions(actions);
    return clone;
  }
  updateSerialCode = () => {
    this.serialCode = this.nodes.slice(this.time).map((node, index) =>
      (node ? `${node.serialCode}[${index}]` : '')).join('');
  }
}
