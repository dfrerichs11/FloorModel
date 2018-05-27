export default class BranchSet {
  constructor(branches) {
    this.state = state;
    this.actionQueue = actionQueue;
    this.active = active;
    this.serialCode = state.serialCode + actionQueue.serialCode;
  }

  addBranch = branch => {};

}