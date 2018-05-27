export default class Branch {
  constructor(state, actionQueue, active) {
    this.state = state;
    this.actionQueue = actionQueue;
    this.active = active;
    this.serialCode = state.serialCode + actionQueue.serialCode;
  }
}
