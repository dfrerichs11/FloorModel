export default class ActionQueueNode {
  constructor(actions = []) {
    this.actions = actions;
    this.addAction = this.addAction.bind(this);
    this.runActions = this.runActions.bind(this);
    this.copy = this.copy.bind(this);
  }
  addAction(action, serialCode) {
    this.actions.push({ action, serialCode });
  }
  runActions(state, callback) {
    this.actions.forEach(action => {
      action.action(state);
      callback(action.serialCode);
    });
  }
  copy = () => new ActionQueueNode(this.actions.slice());
}
