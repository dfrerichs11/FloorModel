import SortedArray from 'sorted-array';

export default class ActionQueueNode {
  constructor(actions = [], serialCode = '') {
    this.actions = new SortedArray(actions, (a, b) => a.serialCode > b.serialCode);
    this.serialCode = serialCode;
    this.addAction = this.addAction.bind(this);
    this.runActions = this.runActions.bind(this);
    this.copy = this.copy.bind(this);
    this.updateSerialCode = this.updateSerialCode.bind(this);
    this.updateSerialCode();
  }
  addAction(action, serialCode) {
    this.actions.insert({ action, serialCode });
    this.updateSerialCode();
  }
  runActions(state) {
    this.actions.array = this.actions.array
      .map(action => {
        if (action.ran) return action;
        action.action(state);
        const newAction = { ...action };
        newAction.ran = true;
        return (newAction);
      });
    this.updateSerialCode();
  }
  copy = () => new ActionQueueNode(this.actions.array.slice(), this.serialCode);
  updateSerialCode = () => {
    this.serialCode = this.actions.array
      .map(action => action.serialCode).join('-');
  }
}
