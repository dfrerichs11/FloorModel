export default class ActionQueueNode {
  constructor(actions = []) {
    this.actions = actions;
    this.addAction = this.addAction.bind(this);
    this.runActions = this.runActions.bind(this);
    this.copy = this.copy.bind(this);
  }
  addAction(action) {
    this.actions.push(action);
  }
  runActions(state) {
    while (this.actions.length) {
      this.actions.shift()(state);
    }
  }
  copy = () => new ActionQueueNode(this.actions.slice());
}
